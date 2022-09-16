import React, {useState} from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import CodeEditor from '../components/CodeEditor';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'General/CodeEditor',
  component: CodeEditor,

} as ComponentMeta<typeof CodeEditor>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CodeEditor> = (args) => { 
  const [localValue, setValue] = useState<string>('');

  const onChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  }

  return (  
            <div style={{height: '100vh'}}>
              <CodeEditor {...args} value={localValue} onChange={(e) => onChangeHandler(e)} />
            </div>
            );

};

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

