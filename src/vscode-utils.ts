import * as vscode from 'vscode';
import { VALID_VARIABLE_NAME_REGEX } from './extension';

export async function getStyleNameToMove(options:string[]) : Promise<{isCustom:boolean,name:string} | undefined>{
  const quickPickItems = [
    { label: 'custom', description: 'new variable' },
    ...options.map((x) => ({ label: x, description: 'pre-defined' })),
  ];

  const quickPickOptions: vscode.QuickPickOptions = {
    placeHolder: 'Enter the name of the new constant or select one of the pre-defined options:',
  };

  const selectedOption = await vscode.window.showQuickPick(quickPickItems, quickPickOptions);

  if (!selectedOption) {
    return;
  }

  let constantName: string | undefined;
  let isCustom  = false;
  if (selectedOption.label === 'custom') {
    constantName = await vscode.window.showInputBox({
      prompt: 'Enter the name of the new constant:',
    });
    if(!VALID_VARIABLE_NAME_REGEX.test(constantName || '')){
			vscode.window.showErrorMessage("Invalid name");
			return;
		}
    isCustom = true;
    if(!!constantName && options.includes(constantName) ){
      isCustom = false;
    }
  } else {
    constantName = selectedOption.label;
  }
  if(constantName === undefined){
    return;
  }
  return {
    name: constantName,
    isCustom
  };

}