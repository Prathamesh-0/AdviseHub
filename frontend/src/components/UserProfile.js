import React, { useEffect, useState } from "react";
import Advice from "./Advice";
import { useParams } from "react-router-dom";
import ShimmerAdvice from "./ShimmerAdvice";

const UserProfile = () => {
  const [advices, setAdvices] = useState([]);
  const [userName, setUserName] = useState("");
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:4000/api/v1/user/${id}`, {
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        'Access-Control-Allow-Origin': 'true'
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log("profile's json : ", json);
        if (
          json.userInfoAndAdvices !== null &&
          json.userInfoAndAdvices !== undefined
        ) {
          setLoading(false);
          setUserName(json.userInfoAndAdvices.username);
          setAdvices(json.userInfoAndAdvices.advices);
        } else {
          setLoading(false);
          setUserName([]);
          setAdvices([]);
        }
      });
  }, [id]);

  return (
    <div className="container mx-auto px-2 overflow-scroll no-scrollbar h-[90vh]">
      <div className="flex justify-between items-center py-3 flex-col">
        <h1 className="text-xl font-bold bg-slate-600 text-center p-2 rounded-3xl mb-2 mx-10 px-8">
          {userName}'s Advices: [{advices.length}]
        </h1>
        <div className="max-w-5xl w-full overflow-auto rounded-3xl">
          {!loading ? (
            advices.map((advice, index) => (
              <Advice key={index} advice={advice} />
            ))
          ) : (
            <>
              <ShimmerAdvice />
              <ShimmerAdvice />
              <ShimmerAdvice />
              <ShimmerAdvice />
              <ShimmerAdvice />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
