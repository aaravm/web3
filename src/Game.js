import { useState, useMemo, useCallback, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import CustomDialog from "./components/CustomDialog";

// import Web3 from "web3"; // Web3.js library
  // import { Dapp } from "@metamask/dapp";
const { ethers } = require("ethers");
// Initialize ethers provider
// const provider = new ethers.providers.Web3Provider(window.ethereum);

// Initialize MetaMask Dapp
// const dapp = new Dapp();
// async function connectToMetaMask() {
//     try {
//       await provider.send("eth_requestAccounts", []);
//       console.log("Connected to MetaMask:", provider);
//     } catch (err) {
//       console.error("Error connecting to MetaMask:", err);
//     }
//   }
  
let chessmoves=[];

const contractAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with your actual contract address
const abi = [
  // Add your contract's ABI here
  // You can generate this from your Solidity contract using tools like Truffle or Remix.
];


function Game({ players, room, orientation, cleanup }) {
  const chess = useMemo(() => new Chess(), []); // <- 1
  const [fen, setFen] = useState(chess.fen()); // <- 2
  const [over, setOver] = useState("");
  async function addtoblock(chessmoves) {
    
    console.log(chessmoves);
    // connectToMetaMask();
  }
  function onDrop(sourceSquare, targetSquare) {
    const moveData = {
      from: sourceSquare,
      to: targetSquare,
      color: chess.turn(),
      // promotion: "q",
    };

    const move = makeAMove(moveData);

    // illegal move
    if (move === null) return false;

    return true;
  }
  
  const makeAMove = useCallback(
    (move) => {
      try {
        const result = chess.move(move); // update Chess instance
        setFen(chess.fen()); // update fen state to trigger a re-render
        chessmoves.push(move.from+move.to);
        // console.log("over, checkmate", chess.isGameOver(), chess.isCheckmate());
  
        if (chess.isGameOver()) { // check if move led to "game over"
          if (chess.isCheckmate()) { // if reason for game over is a checkmate
            // Set message to checkmate. 
            setOver(
              `Checkmate! ${chess.turn() === "w" ? "black" : "white"} wins!`
            ); 
            addtoblock(chessmoves);
            // The winner is determined by checking which side made the last move
          } else if (chess.isDraw()) { // if it is a draw
            setOver("Draw"); // set message to "Draw"
          } else {
            setOver("Game over");
          }
        }
  
        return result;
      } catch (e) {
        return null;
      } // null if the move was illegal, the move object if the move was legal
    },
    [chess]
  );
  
  // Game component returned jsx
  return (
    <>
      <div className="board">
        <Chessboard position={fen} onPieceDrop={onDrop} />  {/**  <- 4 */}
      </div>
      <CustomDialog // <- 5
        open={Boolean(over)}
        title={over}
        contentText={over}
        handleContinue={() => {
          setOver("");
        }}
      />
    </>
  );
}

export default Game;