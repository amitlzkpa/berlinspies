# Berlin Spies
A spy game based off of public transit schedules.

## Demo
[berlinspies.com](https://berlinspies.com)

## Create a game
- To create a game you need to have a blockstack and URL to the game.  
- To create blockstack id follow instructions on the following link.  
[Setup blockstack id](https://docs.blockstack.org/develop/zero_to_dapp_1.html)
- Login with your id.  
- Click on "New Game" on top right.  
- Fill up the form with details.  
- On successful submission you'll get the id to your game.  
- Save this and go to the next steps.  

## Join a game  
- Go the game page.  
- On the top you'll see a link to paste the game id.  
- Use the id from the previous step and fetch your game.  
- You'll see activated controls based on when it is your turn in the game.  
- Read the gameplay instructions to learn how the game works.  

## Gameplay
- The game is based off of Scotland Yard game.  
- Every game has it's players invited by their blockstack created by the game creator.  
- One player is the spy and the objective of the other players(cops) to catch the spy.  
- The game progresses as players move about the board.  
- Any player can move or skip on their turn.  
- On their their turn a player can choose to move to one city that they can travel to based on their time, location and money.  
- If a player decides to move they have to pay the ticket fare and their cash reduces by that amount.  
- The game ends when one of the following events happen:
  - The number of turns in the game passes the end term specified by the game creator. The spy is declared the winner.  
  - One of the spies land on the same location as where the spy is currently located.
- Spies start with a lot more starting cash than each cop, this gives them flexibility to move around the board. 
- Spies also keep their position secret on the board except in the reveal turn where the full board is visible to all players.  
- The game automatically figures out if either of the end conditions have been met and declares thr winner.  
