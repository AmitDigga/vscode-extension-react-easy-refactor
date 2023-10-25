import * as babel from '@babel/core';
import { ParseResult } from '@babel/parser';
import * as t from '@babel/types';
import { isVariableDeclarationPath, isVariableDeclarator } from './path-utils';
import { StyleDeclaration, isInitDirectStylesDeclarationPath, isInitStylesheetCreateDeclarationPath } from './refactor-utils';

export class ReactFile {
	lastImport : number | null = null;
	styleDeclarations: StyleDeclaration[] | null = null;

	constructor(public readonly ast: ParseResult<t.File>) {
	}

	getLastImportDeclaration(): number {
		if (this.lastImport !== null) {
			return this.lastImport;
		}
		let lastImport = 0;
		this.ast.program.body.forEach(node => {
			if (t.isImportDeclaration(node)) {
				lastImport = Math.max(lastImport, node.loc?.end.line ?? 0);
			}
		});
		this.lastImport = lastImport;
		return lastImport;
	}


	getPossibleOptionsForStyleDeclaration(): string[] {
		const declarations = this.getAllPossibleStyleDeclaration();
		return declarations.map(declaration => declaration.name.node.name);
	}
	getStyleDeclarationWithName(name:string): StyleDeclaration| undefined {
		const declarations = this.getAllPossibleStyleDeclaration();
		return declarations.find(declaration => declaration.name.node.name === name);
	}
	getAllPossibleStyleDeclaration(): StyleDeclaration[] {
		if (this.styleDeclarations != null) {
			return this.styleDeclarations;
		}
		const result: StyleDeclaration[] = [];
		babel.traverse(this.ast, {
			Program(path) {
				const body = path.get('body');
				body.forEach(path => {
					if(path.isExportNamedDeclaration()){
						const declaration = path.get('declaration');
						if (isVariableDeclarationPath(declaration)) {
							path = declaration;
						}
					}
					if (isVariableDeclarationPath(path)) {
						const declaration = path.get('declarations')[0];

						if (isVariableDeclarator(declaration)) {
							let data = isInitDirectStylesDeclarationPath(declaration);
							if (data !== false) {
								result.push({
									name: data.name,
									objectDeclaration: data.objectExpression,
								});
							} else {
								const data = isInitStylesheetCreateDeclarationPath(declaration);
								if (data !== false) {
									result.push({
										name: data.name,
										objectDeclaration: data.objectExpression,
									});
								}
							}
						}
					}
				});
				path.stop();
			}
		});
		this.styleDeclarations = result;
		return result;
	}
}
