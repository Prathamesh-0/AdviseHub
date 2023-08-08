import React, { useEffect, useState } from "react";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  useEffect(() => {
    fetch("http://localhost:4000/api/v1/leaderboard", {
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.users !== null && json.users !== undefined)
          setLeaderboardData(json.users);
      });
  }, []);

  return (
    <div className="bg-green-500 p-8 rounded-lg shadow mt-3 overflow-scroll no-scrollbar">
      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left px-4 py-2">Rank</th>
            <th className="text-left px-4 py-2">Name</th>
            <th className="text-left px-4 py-2">Points</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((user, index) => (
            <tr key={user.id} className={index % 2 === 0 ? "bg-gray-100" : ""}>
              <td className="px-4 py-2">{index + 1}</td>
              <td className="break-words px-4 py-2">{user.username}</td>
              <td className="px-4 py-2">{user.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
