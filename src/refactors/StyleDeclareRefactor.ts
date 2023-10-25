import * as babel from '@babel/core';
import { ParseResult } from '@babel/parser';
import { IRefactor, IChange, IAction } from './interfaces/IRefactor';
import { ReactFile } from './ReactFile';

export class StyleDeclareRefactor implements IRefactor {
	constructor(private name:string){}
	refactor(ast: ParseResult<babel.types.File>): IAction {
		const reactFile = new ReactFile(ast);
		const lastImport = reactFile.getLastImportDeclaration();
		return {
			type: 'required',
			changes: [
				{
					type: 'insert',
					start: { line: lastImport+1, column: 0 },
					text: `const ${this.name} = {};\n`
				}
			],
			name: 'Declare Style Block',
			diagnostics: [],
		};

	}
}
