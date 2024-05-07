import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import AnimatedCard from "../motionComponents/AnimatedCard.js";

function Likes({ spotify }) {
  try {
    // Make a GET request to the server
    const response = await axios.get('http://localhost:30001/hello');
    res.send(response.data); // Send the response from the server to the client
  } catch (error) {
    res.status(500).send('Error: ' + error.message); // Handle errors
  }
}
