import React from 'react'

const About = () => {
  return (
    <div className="w-full max-w-screen overflow-x-hidden px-6">
      <div className="flex flex-col items-center text-center py-12 max-w-4xl mx-auto space-y-6">
        <h1 className="text-5xl sm:text-7xl md:text-[5rem]">
          About <span className="italic">Notiqo</span>
        </h1>
        <p className="text-lg">
          Notiqo is a real-time collaborative notepad that lets you and your team write simultaneously without interruptions. 
          No signups, no accounts—just a code and you're in.
        </p>
      </div>

      <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-5 text-lg">
        <p>
          <span className="font-semibold italic">Smarter:</span> Notiqo intelligently manages collaboration with real-time syncing and password-protected private rooms—so your work stays organized and secure.
        </p>
        <p>
          <span className="font-semibold italic">Faster:</span> No signups, no setup. Just enter a room code and start writing. Changes sync instantly across all connected users.
        </p>
        <p>
          <span className="font-semibold italic">Better:</span> The interface is clean and minimal, designed to eliminate distractions. Whether you're drafting ideas, planning tasks, or sharing quick thoughts, it just works.
        </p>
        <p>
          <span className="font-medium">Write</span> <span className="font-semibold italic">Together</span>, <span className="font-medium">from</span> <span className="font-semibold italic">Anywhere:</span> Whether you're across the table or across the world, Notiqo keeps everyone on the same page—literally.
        </p>
      </div>

      <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-5 pt-12 text-lg pb-20">
        <h2 className="text-2xl font-semibold">Public & Private Rooms</h2>
        <p>
          Notiqo offers two simple ways to collaborate: <strong>public rooms</strong> and <strong>private rooms</strong>.
        </p>
        <p>
          <strong>Public rooms</strong> require only a code—no passwords, no logins. Anyone with the code can join, read, and contribute in real-time, making it perfect for quick brainstorming or open collaboration.
        </p>
        <p>
          <strong>Private rooms</strong> offer an added layer of security with password protection. Only users with the correct password can edit the note, while others can view it without making changes. It's ideal for managing sensitive ideas, controlled access, or focused team workflows.
        </p>
        <p>
          With both options, you get seamless, real-time editing—just the way you need it.
        </p>
      </div>
    </div>
  )
}

export default About
