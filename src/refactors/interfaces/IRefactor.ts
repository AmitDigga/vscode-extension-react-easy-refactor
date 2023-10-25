import * as babel from '@babel/core';
import { ParseResult } from '@babel/parser';


export interface IRefactor {
	refactor(ast: ParseResult<babel.types.File>): IAction;
}

export type BLoc = {
	line: number;
	column: number;
};

export type IAnalysis = {
	range: {
		start: BLoc,
		end: BLoc,
	},
	severity: 'error' | 'warning' | 'info' | 'hint',
	message: string,
};

export type IAction = {
	name: string,
	type: 'required',
	changes: IChange[],
	diagnostics: IAnalysis[],
} | {
	type: 'none',
};

export type IChange = {
	type: 'none'
} |
{
	type: 'delete',
	start: BLoc,
	end: BLoc,
} |
{
	type: 'insert',
	start: BLoc,
	text: string
} |
{
	type: 'replace',
	start: BLoc,
	end: BLoc,
	text: string
} |
{
	type: 'multiple',
	changes: IChange[],
};