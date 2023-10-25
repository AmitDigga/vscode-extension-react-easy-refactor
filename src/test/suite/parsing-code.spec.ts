import * as assert from 'assert';
import { FullRefactor } from '../../refactors/FullRefactor';

const tests = [
	{
		message:'Should parse import statements',
		code:'import React from "react";',
		problem: false,
	},
	{
		message:'Should parse import statements with alias',
		code:'import React as R from "react";',
		problem: false,
	},
	{
		message:'Should parse require statements',
		code:'const React = require("react");',
		problem: false,
	},
	{
		message:'Should parse code having type declration',
		code:'const App : ()=>React.Element = ()=>{};',
		problem: false,
	},
	{
		message:'Should parse code having optional chaining (?.) operator',
		code:'const App : ()=>React.Element = (props)=>{ return props.react?.true ? <T>A</T>:<T>B</T>};',
		problem: false,
	},
	{
		message:'Should parse code having ?? operator',
		code:'const App : ()=>React.Element = (props)=>{ return props.react ?? <T>A</T>};',
		problem: false,
	},
	{
		message:'Should parse code when react fragment is used',
		code:'const App : ()=>React.Element = (props)=>{ return <><T>A</T><T>B</T></>};',
		problem: false,
	},
	{
		message:'Should parse code when export statement is used',
		code:'export const App : ()=>React.Element = (props)=>{ return <><T>A</T><T>B</T></>};',
		problem: false,
	},
	{
		message:'Should not parse code when there is constant violation',
		code:'const App : ()=>React.Element = (props)=>{ return <><T>A</T><T>B</T></>}; const App = 3;',
		problem: true,
	}
];


suite('Parsing code', () => {

	tests.forEach(({code,problem,message})=>{
		test(message,()=>{
			const ast = FullRefactor.parseCode(code);
			if(problem){
				assert.equal(ast,null);
			}else{
				assert.notEqual(ast,null);
			}
		});

	});

});