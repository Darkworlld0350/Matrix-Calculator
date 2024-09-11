import { useState } from "react";
import './Calculator.css'; // Import CSS

function Calculator() {
    const [matrix1, setMatrix1] = useState<number[][]>([[0]]); // Starts with a 1x1 matrix
    const [matrix2, setMatrix2] = useState<number[][]>([[0]]);
    const [resultMatrix, setResultMatrix] = useState<number[][] | null>(null);
    const [dimension, setDimension] = useState(1); // default dimension is 1 (1D)
    const [operation, setOperation] = useState('Add'); // default operation is Add


// Utility functions for matrix operations
function addMatrices(matrix1: number[][], matrix2: number[][]): number[][] {
    return matrix1.map((row, i) => row.map((val, j) => val + matrix2[i][j]));
}

function subtractMatrices(matrix1: number[][], matrix2: number[][]): number[][] {
    return matrix1.map((row, i) => row.map((val, j) => val - matrix2[i][j]));
}

function multiplyMatrices(matrix1: number[][], matrix2: number[][]): number[][] {
    const result = Array.from({ length: matrix1.length }, () =>
        Array(matrix2[0].length).fill(0)
    );
    for (let i = 0; i < matrix1.length; i++) {
        for (let j = 0; j < matrix2[0].length; j++) {
            for (let k = 0; k < matrix2.length; k++) {
                result[i][j] += matrix1[i][k] * matrix2[k][j];
            }
        }
    }
    return result;
}

function inverseMatrix(matrix: number[][]): number[][] {
    if (matrix.length === 2 && matrix[0].length === 2) {
        const det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
        if (det === 0) {
            throw new Error("Matrix is not invertible");
        }
        return [
            [matrix[1][1] / det, -matrix[0][1] / det],
            [-matrix[1][0] / det, matrix[0][0] / det],
        ];
    }
    throw new Error("Only 2x2 matrix inversion is supported");
}
    // Adjust matrix dimensions based on user selection
    function createEmptyMatrix(dim: number): number[][] {
        return Array.from({ length: dim }, () =>
            Array(dim).fill(0)
        );
    }

// Dynamically add a row/element to the matrix (for 1D and 2D matrices only)
function addElementToMatrix() {
    if (dimension === 1) {
        setMatrix1([...matrix1, [0]]);  // Adds another element to the 1D array
        setMatrix2([...matrix2, [0]]);
    } else if (dimension === 2) {
        const newMatrix1 = matrix1.map(row => [...row, 0]);  // Add a column
        newMatrix1.push(Array(newMatrix1[0].length).fill(0)); // Add a new row
        setMatrix1(newMatrix1);

        const newMatrix2 = matrix2.map(row => [...row, 0]);
        newMatrix2.push(Array(newMatrix2[0].length).fill(0));
        setMatrix2(newMatrix2);
    }
}

// Dynamically remove the last row/element from the matrix (for 1D and 2D matrices only)
function removeElementFromMatrix() {
    if (dimension === 1 && matrix1.length > 1) {
        setMatrix1(matrix1.slice(0, -1));  // Remove the last element in 1D
        setMatrix2(matrix2.slice(0, -1));
    } else if (dimension === 2 && matrix1.length > 1 && matrix2.length > 1) {
        setMatrix1(matrix1.slice(0, -1).map(row => row.slice(0, -1)));  // Remove the last row and column
        setMatrix2(matrix2.slice(0, -1).map(row => row.slice(0, -1)));
    }
}


    // Operations
    function handleAddition() {
        setResultMatrix(addMatrices(matrix1, matrix2));
    }

    function handleSubtraction() {
        setResultMatrix(subtractMatrices(matrix1, matrix2));
    }

    function handleMultiplication() {
        setResultMatrix(multiplyMatrices(matrix1, matrix2));
    }

    function handleInverse() {
        if (matrix1.length !== 2 || matrix1[0].length !== 2) {
            alert("Only 2x2 matrix inversion is supported.");
            return;
        }
    
        try {
            setResultMatrix(inverseMatrix(matrix1));
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert("An unknown error occurred");
            }
        }
    }

    function handleDimensionChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const newDim = parseInt(event.target.value, 10);
        setDimension(newDim);
        setMatrix1(createEmptyMatrix(newDim));
        setMatrix2(createEmptyMatrix(newDim));
        setResultMatrix(null); // Clear result
    }

    function handleReset() {
        setResultMatrix(null);
        setOperation('Add');
        setMatrix1([[0]]);
        setMatrix2([[0]]);
        setDimension(1);
      }

    // Handle matrix input change
    function handleMatrixChange(
        matrixNumber: number,
        row: number,
        col: number,
        value: string
    ) {
        const newValue = parseFloat(value);
        const updatedMatrix = matrixNumber === 1 ? [...matrix1] : [...matrix2];
        updatedMatrix[row][col] = isNaN(newValue) ? 0 : newValue;
        matrixNumber === 1 ? setMatrix1(updatedMatrix) : setMatrix2(updatedMatrix);
    }
    
    // Handle operation selection
    function handleOperationChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setOperation(event.target.value);
    }

    // Execute selected operation
    function handleExecuteOperation() {
        switch (operation) {
            case 'Add':
                handleAddition();
                break;
            case 'Subtract':
                handleSubtraction();
                break;
            case 'Multiply':
                handleMultiplication();
                break;
            case 'Inverse':
                handleInverse();
                break;
            default:
                console.error(`Unknown operation: ${operation}`);
        }
    }

    return (
        <div className="matrix-calculator">
            <h2>Matrix Calculator</h2>

            {/* Dimension Selector */}
            <label htmlFor="dimension">Dimension:</label>
            <select className="select" value={dimension} onChange={handleDimensionChange}>
                <option value={1}>1x1 (One Dimension)</option>
                <option value={2}>2x2 (Two Dimension)</option>
                <option value={3}>3x3 (Three Dimension)</option>
            </select>

            {/* Operation Selector */}
            <label htmlFor="operation">Operation:</label>
            <select className="select" value={operation} onChange={handleOperationChange}>
                <option value="Add">Add</option>
                <option value="Subtract">Subtract</option>
                <option value="Multiply">Multiply</option>
                <option value="Inverse">Inverse</option>
            </select>

            {/* Matrix 1 Input */}
            <div>
                <h3>Matrix 1</h3>
                {matrix1.map((row, rowIndex) => (
                    <div key={rowIndex}>
                        {row.map((_, colIndex) => (
                            <input className="input"
                                key={`${rowIndex}-${colIndex}`}
                                type="numeric"
                                value={matrix1[rowIndex][colIndex]}
                                onChange={(e) =>
                                    handleMatrixChange(1, rowIndex, colIndex, e.target.value)
                                }
                            />
                        ))}
                    </div>
                ))}
            </div>

            {/* Matrix 2 Input */}
            {operation !== 'Inverse' && (
                <div>4
                    <h3>Matrix 2</h3>
                    {matrix2.map((row, rowIndex) => (
                        <div key={rowIndex}>
                            {row.map((_, colIndex) => (
                                <input className="input"
                                    key={`${rowIndex}-${colIndex}`}
                                    type="numeric"
                                    value={matrix2[rowIndex][colIndex]}
                                    onChange={(e) =>
                                        handleMatrixChange(2, rowIndex, colIndex, e.target.value)
                                    }
                                />
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {/* Buttons to dynamically add/remove elements */}
            <div className="Buttoncontainer">
                <button onClick={addElementToMatrix}>Add Element</button>
                <button onClick={removeElementFromMatrix}>Remove Element</button>
            </div>

            {/* Execute Operation */}
            <button onClick={handleExecuteOperation}>Execute</button>

            {/* Clear/Reset Button */}
            {resultMatrix !== null && (
            <button onClick={() => {
                handleReset();
                setResultMatrix(null);
            }}>Clear</button>
            )}
            
            {/* Result Matrix */}
            {resultMatrix && (
                <div>
                    <h3>Result</h3>
                    {resultMatrix.map((row, rowIndex) => (
                        <div key={rowIndex}>
                            {row.map((value, colIndex) => (
                                <span className="result" key={`${rowIndex}-${colIndex}`}>{value} </span>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Calculator;

