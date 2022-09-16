import styles from '../styles/CodeEditor.module.css';
import React, { FunctionComponent, useRef} from 'react'
import { useEffect } from 'react';


type CodeEditorProps = {
    className?: string,
    value: string;
    onChange: React.ChangeEventHandler<HTMLTextAreaElement>
}

// const CodeEditor: FunctionComponent<CodeEditorProps> =  ({ value, onValueChange }) => {


//     const AddLineNumbers = (code: string) : string => {
//         return code.split('\n').map((line) => `<span class=${styles.container_editor_line_number}>${line}</span>`).join('\n');
//     }

//     return(
//         <Editor minclassName={styles.container__editor} textareaClassName={styles.container__textarea} preClassName={styles.container__pre} style={{counterReset: "line"}}value={value} onValueChange={onValueChange} highlight={AddLineNumbers}></Editor>
//     )
// }



const CodeEditor: FunctionComponent<CodeEditorProps> = ({className, value, onChange}) => {
    const codeInputRef = useRef<HTMLTextAreaElement>(null);
    const lineNumRef = useRef<HTMLTextAreaElement>(null);

    const generateLineNumbers = (code: string) => {
        return code.split('\n').map((val, idx) => idx + 1).join("\n");
    };

    const handleScroll = () => {
        if (lineNumRef.current !== null && codeInputRef.current !== null) {
            lineNumRef.current.scrollTop = codeInputRef.current?.scrollTop | 0;
        }
    }


    return (
        <div className={`${className} ${styles.CodeEditor_default}`}>
            <textarea id="lineNumbers" 
                      className={styles.lineNumber_textarea} 
                      ref={lineNumRef}
                      value={generateLineNumbers(value)} 
                      disabled={true} />
                      
            <textarea id="codeInput" value={value} wrap={"off"} ref={codeInputRef} className={styles.userInput_textarea} onChange={onChange} onScroll={handleScroll}/>
        </div>
    )
}


export default CodeEditor;

