import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting,normalizePath,Platform } from 'obsidian';
import {spawn,ChildProcess, exec, ExecException, ExecOptions, spawnSync} from "child_process";

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
    mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
    mySetting: 'default'
}

export default class MyPlugin extends Plugin {
    settings: MyPluginSettings;
    shell: ChildProcess;
    
    async onload() {
	await this.loadSettings();

	this.addCommand({
	    id: 'open-with-emacsclient',
	    name: 'Open with emacsclient',
	    callback: () => {

                if (this.shell === undefined) {
                    this.shell = spawn("bash");
                }
                const file = this.app.workspace.getActiveFile();
                if (file) {
                    const filePath = `${this.app.vault.adapter.basePath}/${file.path}`;
                    let cmd = `/usr/local/bin/emacsclient -n "${filePath}"\n`
                    this.shell.stdin.write(cmd);   
                }
                
	    }})
    }

    onunload() {

    }

    async loadSettings() {
	this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
	await this.saveData(this.settings);
    }

    getAbsolutePathOfFile(file: TFile): string {
	//@ts-ignore
	const path = normalizePath(`${this.app.vault.adapter.basePath}/${file.path}`)
	if (Platform.isDesktopApp && navigator.platform === "Win32") {
	    return path.replace(/\//g, "\\");
	}
	return path;
    }
}

