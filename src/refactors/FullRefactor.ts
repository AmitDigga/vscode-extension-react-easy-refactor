import * as babel from '@babel/core';
import { ParseResult } from '@babel/parser';
// @ts-ignore
import pluginTransformTypescript from '@babel/plugin-transform-typescript';
import { IRefactor, IChange, IAction } from './interfaces/IRefactor';


export class FullRefactor {
	constructor(private refactors: IRefactor[]) { }

	
	refactor(code: string): IAction[] {
		let ast: ParseResult<babel.types.File> | null = null;
		try {
			ast = babel.parseSync(code, {
				plugins: [
					[pluginTransformTypescript, { isTSX: true }]
				],
			});
		} catch (e) {
			console.log(e);
		}
		if (ast == null) {
			return [];
		} else {
			const theAst: ParseResult<babel.types.File> = ast;
			return this.refactors.map(refactor => refactor.refactor(theAst));
		}
	}

	static parseCode(code:string){
		return babel.parseSync(code, {
			plugins: [
				[pluginTransformTypescript, { isTSX: true }]
			],
		});
	}
	static parseCodeSafe(code:string){
		try {
			return FullRefactor.parseCode(code);
		}catch{
			return null;
		}
	}

}
