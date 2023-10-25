import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { MOVE_ALL_STYLES_TO_CONSTANT_COMMAND , RENAME_AUTO_GENERATED_STYLES_COMMAND} from '../../extension';
import * as sinon from 'sinon';
import { expect } from 'chai';
import * as Path from 'path';
// import * as myExtension from '../../extension';
const DIR_PATH = __dirname;
const TEST_WORKSPACE_PATH = Path.join(DIR_PATH,'..','..','..','test-workspace');


const codeTSX = `import React from "react";

interface Props {
  title: string;
  styles: {
    container: React.CSSProperties;
  };
}

const MyComponent: React.FC<Props> = ({ title, styles }) => {
  return (
    <div style={styles.container}>
      <h1
        style={{
          color: "#333",
          fontSize: "24px",
          fontWeight: "bold",
          textAlign: "center",
          lineHeight: "1.5",
          letterSpacing: "1px",
          textTransform: "uppercase",
          fontFamily: "Arial, sans-serif",
          margin: "0 0 20px 0",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)",
          background: "linear-gradient(to bottom, #fff, #f2f2f2)",
          outline: "none",
          transition: "all 0.3s ease",
          cursor: "pointer",
          userSelect: "none",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden",
          maxHeight: "100px",
          minHeight: "20px",
        }}
      >
        {title}
      </h1>
      <p style={{ fontStyle: "italic", color: "gray" }}>
        This is some sample text.
      </p>
    </div>
  );
};

export default MyComponent;
`;

const solutionTSX = `import React from "react";
const STYLES = {
  HEADER: {
    color: "#333",
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: "1.5",
    letterSpacing: "1px",
    textTransform: "uppercase",
    fontFamily: "Arial, sans-serif",
    margin: "0 0 20px 0",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)",
    background: "linear-gradient(to bottom, #fff, #f2f2f2)",
    outline: "none",
    transition: "all 0.3s ease",
    cursor: "pointer",
    userSelect: "none",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    maxHeight: "100px",
    minHeight: "20px"
  },
  INFO: {
    fontStyle: "italic",
    color: "gray"
  }
};

interface Props {
  title: string;
  styles: {
    container: React.CSSProperties;
  };
}

const MyComponent: React.FC<Props> = ({ title, styles }) => {
  return (
    <div style={styles.container}>
      <h1
        style={STYLES.HEADER}
      >
        {title}
      </h1>
      <p style={STYLES.INFO}>
        This is some sample text.
      </p>
    </div>
  );
};

export default MyComponent;
`;
const codeJSX = `import React from "react";



const MyComponent = ({ title, styles }) => {
  return (
    <div style={styles.container}>
      <h1
        style={{
          color: "#333",
          fontSize: "24px",
          fontWeight: "bold",
          textAlign: "center",
          lineHeight: "1.5",
          letterSpacing: "1px",
          textTransform: "uppercase",
          fontFamily: "Arial, sans-serif",
          margin: "0 0 20px 0",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)",
          background: "linear-gradient(to bottom, #fff, #f2f2f2)",
          outline: "none",
          transition: "all 0.3s ease",
          cursor: "pointer",
          userSelect: "none",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden",
          maxHeight: "100px",
          minHeight: "20px",
        }}
      >
        {title}
      </h1>
      <p style={{ fontStyle: "italic", color: "gray" }}>
        This is some sample text.
      </p>
    </div>
  );
};

export default MyComponent;
`;

const solutionJSX = `import React from "react";
const STYLES = {
  HEADER: {
    color: "#333",
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: "1.5",
    letterSpacing: "1px",
    textTransform: "uppercase",
    fontFamily: "Arial, sans-serif",
    margin: "0 0 20px 0",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)",
    background: "linear-gradient(to bottom, #fff, #f2f2f2)",
    outline: "none",
    transition: "all 0.3s ease",
    cursor: "pointer",
    userSelect: "none",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    maxHeight: "100px",
    minHeight: "20px"
  },
  INFO: {
    fontStyle: "italic",
    color: "gray"
  }
};



const MyComponent = ({ title, styles }) => {
  return (
    <div style={styles.container}>
      <h1
        style={STYLES.HEADER}
      >
        {title}
      </h1>
      <p style={STYLES.INFO}>
        This is some sample text.
      </p>
    </div>
  );
};

export default MyComponent;
`;


suite('Extension Test Suite', () => {

	vscode.window.showInformationMessage('Testing');
	// await vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', uri);
		// const diagnosticCollection = vscode.languages.createDiagnosticCollection();
		// const diagnoses = diagnosticCollection.get(uri);
		// assert.strictEqual(diagnoses?.length, 1);



	// const ext_________ = vscode.extensions.getExtension('AmitDigga.react-easy-refactor');
	// 	assert.equal(ext_________?.isActive,true);

	// test('Extension Loaded', () => {
	// 	assert.ok(vscode.extensions.getExtension('AmitDigga.react-easy-refactor'));
	// });
	// test('Extension Activated', () => {
	// 	const ext = vscode.extensions.getExtension('AmitDigga.react-easy-refactor');
	// 	assert.equal(ext?.isActive,true);
	// });

	async function withCode(code:string, fileExtension:'tsx'|'jsx'){
		await new Promise(resolve => setTimeout(resolve, 2000));
    const workspaceFolder = TEST_WORKSPACE_PATH;
    const filePath = Path.join(workspaceFolder, `HelloWorld.${fileExtension}`);
    const uri = vscode.Uri.file(filePath);
		const document = await vscode.workspace.openTextDocument(uri);
		await vscode.window.showTextDocument(document);
		await vscode.window.activeTextEditor?.edit(e=> e.replace(getRangeForDocument(document),code));
		return {document};
	}
	// async function getCodeActionsForDocument(document:vscode.TextDocument): Promise<vscode.CodeAction[]>{
	// 	return await vscode.commands.executeCommand('vscode.executeCodeActionProvider', document.uri,getRangeForDocument(document));
	// }

	async function getCommand(command:string): Promise<boolean>{
		const commands = await vscode.commands.getCommands(true);
		return !!commands.find(c=>c===command);
	}

	test('Should work in tsx file', async() => {
		await withCode(`const a : any = 2; <div></div>`,'tsx');
		const hasMoveAllStylesCommand = await getCommand(MOVE_ALL_STYLES_TO_CONSTANT_COMMAND);
		assert.equal(hasMoveAllStylesCommand,true);
	});
	test('Should work in jsx file', async() => {
		await withCode(`const a = 2; <div></div>`,'jsx');
		const hasMoveAllStylesCommand = await getCommand(MOVE_ALL_STYLES_TO_CONSTANT_COMMAND);
		assert.equal(hasMoveAllStylesCommand,true);
	});

	test("Should have command 'Move all styles to constant'", async() => {
		const hasMoveAllStylesCommand = await getCommand(MOVE_ALL_STYLES_TO_CONSTANT_COMMAND);
		assert.equal(hasMoveAllStylesCommand,true);
	});
	test("Should have command 'Rename auto generated styles'", async() => {
		const hasRenameAutoGeneratedStylesCommand = await getCommand(RENAME_AUTO_GENERATED_STYLES_COMMAND);
		assert.equal(hasRenameAutoGeneratedStylesCommand,true);
	});

	test("Invoking move style command should update typescript code", async() => {
    const {document} = await withCode(codeTSX,'tsx');
    const sandbox  = sinon.createSandbox();
    sandbox.stub(vscode.window, 'showQuickPick').resolves({
       label: 'custom', description: 'new variable' 
    });
    sandbox.stub(vscode.window, 'showInputBox')
    .onCall(0).resolves('STYLES')
    .onCall(1).resolves('HEADER')
    .onCall(2).resolves('INFO');
    await vscode.commands.executeCommand(MOVE_ALL_STYLES_TO_CONSTANT_COMMAND);
    await vscode.commands.executeCommand(RENAME_AUTO_GENERATED_STYLES_COMMAND);
    sandbox.restore();
    const vscodeText = document.getText().replace(/\r/g,'').replace(/\r\n/g,'');
    const expectedText = solutionTSX.replace(/\r/g,'').replace(/\r\n/g,'');
    expect(vscodeText).to.equal(expectedText);
    
	});

	test("Invoking move style command should update javascript code", async() => {
    const {document} = await withCode(codeJSX,'jsx');
    const sandbox  = sinon.createSandbox();
    sandbox.stub(vscode.window, 'showQuickPick').resolves({
       label: 'custom', description: 'new variable' 
    });
    sandbox.stub(vscode.window, 'showInputBox')
    .onCall(0).resolves('STYLES')
    .onCall(1).resolves('HEADER')
    .onCall(2).resolves('INFO');
    await vscode.commands.executeCommand(MOVE_ALL_STYLES_TO_CONSTANT_COMMAND);
    await vscode.commands.executeCommand(RENAME_AUTO_GENERATED_STYLES_COMMAND);
    sandbox.restore();
    const vscodeText = document.getText().replace(/\r/g,'').replace(/\r\n/g,'');
    const expectedText = solutionJSX.replace(/\r/g,'').replace(/\r\n/g,'');
    expect(vscodeText).to.equal(expectedText);
    
	});


	// test('Should work in jsx file', async() => {
	// 	const {document } = await withCode(`<div></div>`,'jsx');
	// 	const codeActions = await getCodeActionsForDocument(document);
	// 	const ourCommand = codeActions.filter(ca=>ca.title==="Declare Style Block");
	// 	assert.equal(ourCommand.length,1);
	// });

	// test('Should not work in txt file', async() => {
	// 	const {document } = await withCode(`<div></div>`,'txt' as 'tsx');
	// 	const codeActions = await getCodeActionsForDocument(document);
	// 	const ourCommand = codeActions.filter(ca=>ca.title==="Declare Style Block");
	// 	assert.equal(ourCommand.length,0);
	// });
	// test('Should not show command when style block is already declared', async() => {
	// 	const {document } = await withCode(` const styles = {} ; const App = ()=> <div></div>;`,'tsx');
	// 	const codeActions = await getCodeActionsForDocument(document);
	// 	const ourCommand = codeActions.filter(ca=>ca.title==="Declare Style Block");
	// 	assert.equal(ourCommand.length,0);
	// });

	// test('Should work when has advance js operators', async() => {
	// 	const {document } = await withCode(` const a :any  = null ?? 2 ; const App = ()=> <div></div>;`,'tsx');
	// 	const codeActions = await getCodeActionsForDocument(document);
	// 	const ourCommand = codeActions.filter(ca=>ca.title==="Declare Style Block");
	// 	assert.equal(ourCommand.length,1);
	// });

	// test('Should work when style block is already declared', async() => {
	// 	const {document } = await withCode(` const styles = {}; const App = ()=> <div style={{color:2}}></div>;`,'tsx');
	// 	const codeActions = await getCodeActionsForDocument(document);
	// 	const ourCommand = codeActions.filter(ca=>ca.title==="Extract all style");
	// 	assert.equal(ourCommand.length,1);
	// });

});

function getRangeForDocument(document:vscode.TextDocument){
	const lastLine = document.lineCount - 1;
	const lastChar = document.lineAt(lastLine).range.end.character;
	return new vscode.Range(new vscode.Position(0,0),new vscode.Position(lastLine,lastChar));
}