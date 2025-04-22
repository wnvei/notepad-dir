const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST']
}));

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST']
  }
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const notes = {};
const privateNotes = {};

io.on('connection', (socket) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('User connected:', socket.id);
  }

  socket.on('join', async (code) => {
    socket.join(code);

    if (!notes[code]) {
      const { data } = await supabase
        .from('notes')
        .select('content')
        .eq('code', code)
        .single();
      
      notes[code] = data?.content || '';
    }

    socket.emit('init-content', notes[code]);
  });

  socket.on('text-change', async ({ code, content }) => {
    notes[code] = content;
    socket.to(code).emit('text-update', content);
    
    await supabase.from('notes').upsert({ code, content });
  });

  socket.on('join-private', async (code) => {
    socket.join(`private-${code}`);

    if (!privateNotes[code]) {
      const { data } = await supabase
        .from('locked_rooms')
        .select('content')
        .eq('code', code)
        .single();
      
      privateNotes[code] = data?.content || '';
    }

    socket.emit('private-init-content', privateNotes[code]);
  });

  socket.on('private-text-change', async ({ code, content }) => {
    privateNotes[code] = content;
    socket.to(`private-${code}`).emit('private-text-update', content);
    await supabase.from('locked_rooms').update({ content }).eq('code', code);
  });

  const cursors = {};
  const clientColors = {};

  socket.on('register-client', ({ code, clientId }) => {
    if (!cursors[code]) {
      cursors[code] = {};
    }
    if (!clientColors[code]) {
      clientColors[code] = {};
    }
    const hue = Math.floor(Math.random() * 360);
    clientColors[code][clientId] = `hsl(${hue}, 80%, 60%)`;
    cursors[code][clientId] = {
      position: 0,
      color: clientColors[code][clientId]
    };
    socket.emit('cursor-positions', cursors[code]);
    socket.to(code).emit('cursor-positions', cursors[code]);
  });

  socket.on('cursor-position', ({ code, clientId, position }) => {
    if (!cursors[code]) {
      cursors[code] = {};
    }
    if (!cursors[code][clientId]) {
      cursors[code][clientId] = {
        position,
        color: clientColors[code]?.[clientId] || `hsl(${Math.floor(Math.random() * 360)}, 80%, 60%)`
      };
    } else {
      cursors[code][clientId].position = position;
    }
    io.to(code).emit('cursor-positions', cursors[code]);
  });

  socket.on('disconnect', () => {
    Object.keys(cursors).forEach(roomCode => {
      Object.keys(cursors[roomCode]).forEach(clientId => {
        if (cursors[roomCode][clientId].socketId === socket.id) {
          delete cursors[roomCode][clientId];
          delete clientColors[roomCode][clientId];
          io.to(roomCode).emit('cursor-positions', cursors[roomCode]);
        }
      });
    });
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Server running at http://localhost:${PORT}`);
  }
});
