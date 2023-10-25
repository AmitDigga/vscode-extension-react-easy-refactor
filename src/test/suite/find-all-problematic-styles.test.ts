import * as assert from 'assert';
import { FullRefactor } from '../../refactors/FullRefactor';
import { findAllProblematicStyles } from '../../refactors/refactor-utils';

const tests = [
	{
		message:'Should show error when style object is empty',
		styleObject:'style={{}}',
		problem: true,
	},
	{
		message:'Should show error on normal style object',
		styleObject:'style={{color:"red"}}',
		problem: true,
	},
	{
		message:'Should show error when object have string quoted properties "color"',
		styleObject:'style={{"color":"red"}}',
		problem: true,
	},
	{
		message:'Should show error when object have properties with bracketed string "color"',
		styleObject:'style={{["color"]:"red"}}',
		problem: true,
	},
	{
		message:'Should not show style={[]} as problem',
		styleObject:'style={[]}',
		problem: false,
	},
	{
		message:'Should not show error when style is not an object expression',
		styleObject:'style={1}',
		problem: false,
	},
	{
		message:'Should not show error when logical expression is used',
		styleObject:'style={isTrue?{color:"red"}:{color:"blue"}}',
		problem: false,
	},
	{
		message:'Should show error when style object property value is a string literal',
		styleObject:'style={{color:"red"}}',
		problem: true,
	},
	{
		message:'Should show error when style object property value is number literal',
		styleObject:'style={{color:1}}',
		problem: true,
	},
	{
		message:'Should show error when style object property value is boolean literal',
		styleObject:'style={{color:true}}',
		problem: true,
	},
	{
		message:'Should show error when there are multiple properties in object which are literal only',
		styleObject:'style={{color:"red",fontSize:12}}',
		problem: true,
	},
	{
		message:'Should not show error when multiple properties in object which are literal only but one of them is not',
		styleObject:'style={{color:"red",fontSize:isTrue?12:14}}',
		problem: false,
	},
];


suite('Find problematic styles', () => {

	tests.forEach(({styleObject,problem,message})=>{
		test(message,()=>{
			const code = `
			import React from 'react';
			const isTrue = true;
			const App : ()=>React.Element = ()=>{
				return <div ${styleObject}></div>
			}`;
			const ast = FullRefactor.parseCode(code);
			if(!ast) {
				assert.fail('Could not parse code');
			}
			const problems = findAllProblematicStyles(ast);
			assert.equal(problems.length,problem?1:0);
		});

	});

});