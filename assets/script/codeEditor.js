document.addEventListener('DOMContentLoaded', () => {
    // Initialize Ace Editor with specific settings
    const editor = ace.edit("editor");
    
    const initializeEditor = () => {
        const isDark = document.body.classList.contains('dark-theme');
        
        // Base editor settings
        editor.setOptions({
            fontSize: 14,
            showPrintMargin: false,
            showGutter: true,
            highlightActiveLine: true,
            wrap: true,
            useSoftTabs: true,
            tabSize: 2,
            mode: "ace/mode/javascript"
        });

        // Theme-specific settings
        if (isDark) {
            editor.setTheme("ace/theme/dracula");
            editor.container.style.backgroundColor = '#1a1b2e';
            editor.renderer.setStyle('dark-theme');
            document.documentElement.style.setProperty('--editor-bg', '#1a1b2e');
            document.documentElement.style.setProperty('--editor-text', '#f8f8f2');
        } else {
            editor.setTheme("ace/theme/sqlserver");
            editor.container.style.backgroundColor = '#ffffff';
            editor.renderer.setStyle('light-theme');
            document.documentElement.style.setProperty('--editor-bg', '#ffffff');
            document.documentElement.style.setProperty('--editor-text', '#333333');
        }
        
        editor.renderer.updateFull();
    };

    // Initialize editor with current theme
    initializeEditor();
    
    // Update theme when it changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                initializeEditor();
            }
        });
    });

    observer.observe(document.body, { attributes: true });

    // Default code templates
    const codeTemplates = {
        javascript: `// Write your JavaScript code here
console.log("Hello, World!");
        
function example() {
  return "Welcome to Sowberry Code Editor";
}`,
        python: `# Write your Python code here
print("Hello, World!")

def example():
    return "Welcome to Sowberry Code Editor"`,
        java: `// Write your Java code here
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
        cpp: `// Write your C++ code here
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
        ruby: `# Write your Ruby code here
puts "Hello, World!"

def example
  "Welcome to Sowberry Code Editor"
end`,
        php: `<?php
// Write your PHP code here
echo "Hello, World!";

function example() {
    return "Welcome to Sowberry Code Editor";
}`,
        csharp: `// Write your C# code here
using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
    }
}`,
        swift: `// Write your Swift code here
print("Hello, World!")

func example() -> String {
    return "Welcome to Sowberry Code Editor"
}`,
        kotlin: `// Write your Kotlin code here
fun main() {
    println("Hello, World!")
}

fun example(): String {
    return "Welcome to Sowberry Code Editor"
}`,
        go: `// Write your Go code here
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,
        rust: `// Write your Rust code here
fn main() {
    println!("Hello, World!");
}

fn example() -> String {
    String::from("Welcome to Sowberry Code Editor")
}`,
        typescript: `// Write your TypeScript code here
console.log("Hello, World!");

function example(): string {
    return "Welcome to Sowberry Code Editor";
}`
    };

    // Set initial code
    editor.setValue(codeTemplates.javascript, -1);

    // Language selection handler
    const languageSelect = document.getElementById('languageSelect');
    languageSelect.addEventListener('change', (e) => {
        const language = e.target.value;
        editor.session.setMode(`ace/mode/${language}`);
        editor.setValue(codeTemplates[language], -1);
    });

    const executeCode = {
        javascript: (code) => {
            const logs = [];
            const oldLog = console.log;
            try {
                // Create a safe execution context
                const context = {
                    console: {
                        log: (...args) => logs.push(args.join(' '))
                    }
                };

                // Wrap code to handle function definitions and calls
                const wrappedCode = `
                    try {
                        ${code}
                        // Auto-execute any defined functions that don't require parameters
                        const definedFuncs = Object.keys(this).filter(key => typeof this[key] === 'function');
                        definedFuncs.forEach(func => {
                            if (this[func].length === 0) {
                                try {
                                    this[func]();
                                } catch(e) {}
                            }
                        });
                    } catch(e) {
                        console.log("Error:", e.message);
                    }
                `;

                Function('console', wrappedCode).call({}, context.console);
                return logs.join('\n') || '// No output';
            } catch (error) {
                throw error;
            } finally {
                console.log = oldLog;
            }
        },
        python: (code) => {
            try {
                const output = [];
                let variables = {};
                let functions = {};
                
                // Parse and execute Python-like code
                code.split('\n').forEach(line => {
                    line = line.trim();
                    if (line.startsWith('print(')) {
                        const content = line.slice(6, -1);
                        try {
                            // Handle variables and expressions
                            if (!content.startsWith('"') && !content.startsWith("'")) {
                                // Evaluate mathematical expressions
                                if (/^[0-9+\-*/() ]+$/.test(content)) {
                                    output.push(eval(content));
                                } else {
                                    // Try to evaluate variables or function calls
                                    const result = new Function(`
                                        with (this) {
                                            return ${content};
                                        }
                                    `).call({ ...variables, ...functions });
                                    output.push(result);
                                }
                            } else {
                                // String literal
                                output.push(content.slice(1, -1));
                            }
                        } catch (e) {
                            output.push(content);
                        }
                    } else if (line.startsWith('def ')) {
                        // Function definition
                        const match = line.match(/def\s+(\w+)\s*\((.*?)\):/);
                        if (match) {
                            const [_, name, params] = match;
                            functions[name] = (...args) => {
                                // Function implementation
                                return `Function ${name} called with ${args.join(', ')}`;
                            };
                        }
                    }
                });
                return output.join('\n') || '// No output';
            } catch (error) {
                throw error;
            }
        }
    };

    // Add support for other languages
    ['java', 'cpp', 'ruby', 'php', 'csharp', 'swift', 'kotlin', 'go', 'rust', 'typescript'].forEach(lang => {
        executeCode[lang] = (code) => {
            try {
                const output = [];
                const printPatterns = {
                    java: /System\.out\.println\((.*?)\);/g,
                    cpp: /cout\s*<<\s*(.*?)\s*(?:<<\s*endl\s*)?;/g,
                    ruby: /puts\s+(.*?)$/gm,
                    php: /echo\s+(.*?);/g,
                    csharp: /Console\.WriteLine\((.*?)\);/g,
                    swift: /print\((.*?)\)/g,
                    kotlin: /println\((.*?)\)/g,
                    go: /fmt\.Println\((.*?)\)/g,
                    rust: /println!\((.*?)\);/g,
                    typescript: /console\.log\((.*?)\);/g
                };

                const pattern = printPatterns[lang];
                const matches = code.matchAll(pattern);
                
                for (const match of matches) {
                    let content = match[1];
                    if (content.startsWith('"') || content.startsWith("'")) {
                        output.push(content.slice(1, -1));
                    } else {
                        try {
                            // Safely evaluate mathematical expressions
                            if (/^[0-9+\-*/() ]+$/.test(content)) {
                                output.push(eval(content));
                            } else {
                                output.push(content);
                            }
                        } catch (e) {
                            output.push(content);
                        }
                    }
                }
                
                return output.join('\n') || '// No output';
            } catch (error) {
                throw error;
            }
        };
    });

    // Run code handler with improved error handling
    const runCode = () => {
        const code = editor.getValue();
        const language = languageSelect.value;
        const output = document.getElementById('output');
        
        output.innerHTML = '<div class="console-output">Running...</div>';
        
        try {
            const result = executeCode[language](code);
            output.innerHTML = `<div class="console-output">${result}</div>`;
        } catch (error) {
            output.innerHTML = `<div class="console-output error">Error: ${error.message}</div>`;
        }
    };

    // Reset code handler
    const resetCode = () => {
        const language = languageSelect.value;
        editor.setValue(codeTemplates[language], -1);
    };

    // Clear output handler
    const clearOutput = () => {
        document.getElementById('output').innerHTML = '<div class="console-output">// Output will appear here...</div>';
    };

    // Button event listeners
    document.getElementById('runCode').addEventListener('click', runCode);
    document.getElementById('resetCode').addEventListener('click', resetCode);
    document.getElementById('clearOutput').addEventListener('click', clearOutput);

    // Keyboard shortcuts
    editor.commands.addCommand({
        name: 'runCode',
        bindKey: {win: 'Ctrl-Enter', mac: 'Command-Enter'},
        exec: runCode
    });
    
    // Update stats in welcome card
    document.querySelector('.welcome-stats .stat-info p').textContent = 
        `${Object.keys(codeTemplates).length} Available`;
});
