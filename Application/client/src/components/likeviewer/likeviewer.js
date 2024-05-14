import React, { useState, useEffect } from "react";
import axios from "axios";

function Likeviewer({ spotify }) {
  console.log("backend likeviewer being created");
  const [allLikes, setAllLikes] = useState(null);
  // allLikes -> User.spotify_id, User.pfp, User.display_name, Song.track_id,  Song.title, Song.artist
  useEffect(() => {
    const showAllLikes = async () => {
        try {
          const response = await axios.get("http://localhost:3001/api/showlikes",
            {params: {}},
            {
              headers: {
                "Content-Type": "application/json"
              }
            }
          );
          
          if (response.status === 200) {
            console.log(response);
            setAllLikes(response.data);
            console.log("successfully retrieved all likes");
          } else {
            console.error("Failed to get all likes");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      };

      showAllLikes();
  }, []);

    const deleteLike = (spotify_id, track_id) => {   
        try {
            const response = axios.post('http://localhost:3001/api/deletelike', JSON.stringify({
                spotify_id,
                track_id,
            }), {
            headers: {
                'Content-Type': 'application/json'
            }
            });

            setAllLikes(prevLikes => prevLikes.filter(item => !(item.spotify_id === spotify_id && item.track_id === track_id)));
    
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <>
          <div className="flex flex-col items-center ml-1 py-8">
            <div className="mt-4 w-full">
              {allLikes && (
                <table className="table-auto mx-auto">
                  <thead>
                    <tr className="bg-blue-900 text-slate-200">
                      <th className="px-4 py-2 font-bold"></th>
                      <th className="px-4 py-2 font-bold">Display Name</th>
                      <th className="px-4 py-2 font-bold">Title</th>
                      <th className="px-4 py-2 font-bold">Artist</th>
                      <th className="px-4 py-2 font-bold"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {allLikes.map((item) => (
                      <tr key={`${item.spotify_id}-${item.track_id}`} className="text-center bg-blue-900 drop-shadow-2xl">
                        <td><img src={item.pfp} alt="pfp.png" className="h-12 w-12 rounded-full mx-auto" /></td>
                        <td className="px-4 py-2 text-slate-200 font-semibold">{item.display_name}</td>
                        <td className="px-4 py-2 text-slate-200 font-semibold">{item.track_name}</td>
                        <td className="px-4 py-2 text-slate-200 font-semibold">{item.track_artist}</td>
                        <td className="px-4 py-2 text-slate-200 font-semibold">
                          <button
                            onClick={() => deleteLike(item.spotify_id, item.track_id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      );
};

export default Likeviewer;