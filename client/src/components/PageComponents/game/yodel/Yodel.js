import Keyboard from "./Keyboard"
import Modal from "./Modal"
import classes from "./Yodel.module.css"
import { ColorContext } from '../../../../store/color-context';
import { useState, useEffect, useContext } from 'react';
import words from './words.json';
import { useQuery } from '@apollo/client'
import { useMutation } from '@apollo/client'
import { QUERY_STATS } from "../../../utils/queries";
import { UPDATE_TRIES } from "../../../utils/mutations";

const Yodel = () => {
    const [textColor, , theme] = useContext(ColorContext);
    const [boxCharacters, setBoxCharacters] = useState([]);
    const [currentRow, setCurrentRow] = useState(0);
    const [currentBox, setCurrentBox] = useState(0);
    const [answer, setAnswer] = useState('MOPS');
    const [day, setDay] = useState(Date());
    const [winState, setWinState] = useState(false);
    const [lossState, setLossState] = useState(false);
    const [informationState, setInformationState] = useState(true);
    const [outcast, setOutcast] = useState([]);
    const [editing, setEditing] = useState(false);

    const [resultBox, setResultBox] = useState([]);
    const [refreshKeys, setRefreshKeys] = useState(true)

    const { loading, data } = useQuery(QUERY_STATS);
    const [updateTries] = useMutation(UPDATE_TRIES);


    const handleKeyPress = (character) => {
        if(!winState){
            if (character === "⌫"){
                // Only delete letters from boxes on the current row
                if(currentBox > currentRow*4){
                    setCurrentBox(currentBox => currentBox - 1);
                    setBoxCharacters(boxCharacters.slice(0,-1));
                }
            }
            else if(character === 'ENTER'){
                if(currentBox === (currentRow*4 + 4)){
                    let newWord = boxCharacters[currentRow*4] + boxCharacters[currentRow*4+1] + boxCharacters[currentRow*4+2] + boxCharacters[currentRow*4+3]
                    if(words.includes(newWord.toLowerCase())){
                        setCurrentRow(currentRow => currentRow + 1);
                        results(newWord);
                    }else{
                        console.log('This word is not in the database')
                    }
                }else{
                    console.log('Complete your word before you submit!');
                }
            }else if(currentBox < (currentRow*4 + 4)){
                setBoxCharacters( boxCharacters => [...boxCharacters, character]);
                setCurrentBox(currentBox => currentBox + 1);
            }
        }
    }

    const results = async (input) => {
        let answerArray = answer.split('');
        let inputArray = input.split('');

        let yodelCount = 0;
        let echoCount = 0;

        for(let i=0; i<4; i++){
            let guess = inputArray[i];
            let reveal = answerArray[i];

            // Check how many letters are contained in the word and in the right location
            if(guess === reveal){
                yodelCount = yodelCount + 1;
            }
            else if(answerArray.includes(guess)){
                echoCount = echoCount + 1;
            }
        }

        setResultBox(resultBox => [...resultBox, yodelCount]);
        setResultBox(resultBox => [...resultBox, echoCount]);

        if(yodelCount === 4){
            setWinState(true);
            addResults(true, currentRow);
        } else if(currentRow === 6){
            setLossState(true);
            addResults(false, currentRow);
        } else if(yodelCount === 0 && echoCount === 0){
            // If all four letters are not included then put those letters into outcast array. These letters will have their keys darkened
            inputArray.forEach(e => {
                setOutcast(outcast => [...outcast, e]);
            });
        }
    }
    
    const newWord = () => {
        let randomNumb = Math.floor(Math.random()*words.length);
        let dailyWord = words[randomNumb].toUpperCase();
    
        setAnswer(dailyWord);
    }
    
    const refresh = () => {
        setBoxCharacters([]);
        setCurrentRow(0);
        setCurrentBox(0);
        setWinState(false);
        setLossState(false);
        setInformationState(false);
        setOutcast([]);
        setEditing(false);
        setResultBox([]);
        setRefreshKeys(true);
        newWord();
    }

    const keyRefresh = () => {
        setRefreshKeys(false);
    }

    const informationOff = () => {
        setInformationState(false);
    }

    const addResults = async (win, count) => {
        let tries;

        // If the play loses then it counts as taking 8 tries
        if(win){
            tries = count + 1;
        } else{
            tries = 8;
        }

        let try1 = data.allStats.stats[0].guess1;
        let try2 = data.allStats.stats[0].guess2;
        let try3 = data.allStats.stats[0].guess3;
        let try4 = data.allStats.stats[0].guess4;
        let try5 = data.allStats.stats[0].guess5;
        let try6 = data.allStats.stats[0].guess6;
        let try7 = data.allStats.stats[0].guess7;
        let try8 = data.allStats.stats[0].guess8;

        switch(tries){
            case 1:
                try1 = try1 + 1;
                break;
            case 2:
                try2 = try2 + 1;
                break;
            case 3:
                try3 = try3 + 1;
                break;
            case 4:
                try4 = try4 + 1;
                break;
            case 5:
                try5 = try5 + 1;
                break;
            case 6:
                try6 = try6 + 1;
                break;
            case 7:
                try7 = try7 + 1;
                break;
            case 8:
                try8 = try8 + 1;
                break;
        }

        let average = (try1 + try2*2 + try3*3 + try4*4 + try5*5 + try6*6 + try7*7 + try8*8)/(data.allStats.stats[0].gamesPlayed + 1);

        try{
            await updateTries({
                variables: {
                    tries: tries,
                    average: average
                }
            });
        }
        catch (err){
            console.log(err)
        }
    }

    useEffect(() => {
        newWord();
    }, [day])

    return(
        <div className={classes.scene}>
            <div className={classes.head}>
                <h1 className={classes.title} style={theme === "#393939" 
                        ? { backgroundColor: `${textColor}52`, color: 'white' } 
                        : { backgroundColor: `${textColor}99`, color: 'black' }}>
                    Yodel
                </h1>

                <div className={classes.buttonDiv}>
                    <button className={`${classes.information} ${classes.button}`} onClick={() => setInformationState(true)} style={theme === "#393939" 
                        ? { backgroundColor: `${textColor}52`, color: 'white' } 
                        : { backgroundColor: `${textColor}99`, color: 'black' }}>
                    ?
                    </button>

                    {/* This button allows the user to enter 'edit' mode... when clicked the button visually looks pressed */}
                    <button className={`${classes.edit} ${classes.button}`} onClick={()=>{editing ? setEditing(false) : setEditing(true)}} style={editing 
                                ? { backgroundColor:'#1cd31c', boxShadow: 'inset 2px 2px 8px #0d3810', content: 'Editing'}
                                : { backgroundColor: 'darkgreen', boxShadow: 'none', content: 'Edit' }}>

                            {/* If the user is editing change button text to match this */}
                            {editing ? 'Editing' : 'Edit'}
                    </button>
                </div>      
            </div>

            {/* Word Boxes */}
            <div className={classes.container} style={theme === "#393939"
                    ? { backgroundColor: 'rgb(41, 41, 41)', color: 'white' }
                    : { backgroundColor:'rgb(41, 41, 41, 0.20)', color: 'black'}}>
                
                {/* Word Row */}
                {[0,1,2,3,4,5,6].map((row, rowIndex) =>(
                    <div className={classes.row} key={rowIndex}>

                        {/* Individual Word Box */}
                        {[0,1,2,3].map((box, boxIndex) => (
                            <div className={classes.box} key={boxIndex}>
                                {boxCharacters[rowIndex*4 + boxIndex]}
                            </div>
                        ))}

                        {/* Results Columns */}
                        <div className={classes.results} key={`results-${rowIndex}`}>
                            <div className={classes.yodel} key={`yodel-${rowIndex}`} style={resultBox[rowIndex*2] > 0 
                            ? { backgroundColor: '#248521'}
                            : { backgroundColor:'#8c8f92'}}>
                                {resultBox[rowIndex*2]}
                            </div>
                            <div className={classes.echo} key={`echo-${rowIndex}`} style={resultBox[rowIndex*2 + 1] > 0 
                            ? { backgroundColor: '#ecf00c'}
                            : { backgroundColor:'#8c8f92'}}>
                                {resultBox[rowIndex*2 + 1]}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Keyboard outcast={outcast} editing={editing} handleKeyPress={handleKeyPress} keyRefresh={keyRefresh} refreshKeys={refreshKeys} />
            
            <button className={`${classes.refresh} ${classes.button}`} onClick={refresh} style={(winState || lossState) ? {display: 'block'} : {display: 'none'}}>Play Again</button>

            <Modal answer={answer} currentRow={currentRow} winState={winState} lossState={lossState} informationState={informationState} refresh={refresh} informationOff={informationOff}/>
        </div>
    )
}

export default Yodel