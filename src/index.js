import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
    const winningStyle = {
        background: '#ff0',
    };

    return (
        <button 
            className="square" 
            onClick={props.onClick}
            style={props.winningSquare ? winningStyle : null}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    
    renderSquare(i) {
        let winningSquare = this.props.winner && this.props.winner.includes(i) ? true : false;
        return (
            <Square 
                value={this.props.squares[i]} 
                onClick={() => this.props.onClick(i)}
                winningSquare={winningSquare}
            />
        );
    }

    render() {
        
        let boardSquares = [];
        for (let row = 0; row < 3; row++) {
            let boardRow = [];
            for (let col = 0; col < 3; col++) {
                boardRow.push(<span key={(row * 3) + col}>{this.renderSquare(row*3 + col)}</span>);
            }
            boardSquares.push(<div className="board-row" key={row}>{boardRow}</div>);
        }

        return (
            <div>
                {boardSquares}
            </div>
        );
    }
}


// Game control
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                coors: [null],
            }],
            xIsNext: true,
            stepNumber: 0,
            ascending: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        const row = Math.floor(i / 3);
        const col = i % 3;
        current.coors[this.state.stepNumber + 1] = [col, row];

        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                coors: current.coors,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    handleSortClick() {
        this.setState({
            ascending: !this.state.ascending,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const active = {
            fontWeight: 'bold',
        };
        const inactive = {
            fontWeight: 'normal',
        };

        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const ascending = this.state.ascending;

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move + " (" + step.coors[move] + ")":
                'Go to game start';
            return (
                <li className="move-list" key={move}>
                    <button 
                        onClick={() => this.jumpTo(move)}
                        style={this.state.stepNumber === move ? active : inactive}
                    >
                        {desc}
                    </button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner.name;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        winner={winner && winner.winningSquares}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={() => this.handleSortClick()}>Sort</button>
                    <ol>{ascending ? moves : moves.reverse()}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                name: squares[a],
                winningSquares: lines[i],
            };
        }
    }
    return null;
}

// ==============================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
