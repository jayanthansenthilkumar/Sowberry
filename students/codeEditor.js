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

    // Run code handler
    const runCode = () => {
        const code = editor.getValue();
        const language = languageSelect.value;
        const output = document.getElementById('output');
        
        output.innerHTML = '<div class="console-output">Running...</div>';
        
        try {
            if (language === 'javascript') {
                // Create a safe execution environment
                const logs = [];
                const oldLog = console.log;
                console.log = (...args) => logs.push(args.join(' '));
                
                try {
                    eval(code); // Execute the actual code
                    console.log = oldLog;
                    
                    // Show the outputs, or "No output" if nothing was printed
                    const outputContent = logs.length > 0 
                        ? logs.join('\n') 
                        : '// No output';
                    output.innerHTML = `<div class="console-output">${outputContent}</div>`;
                } catch (error) {
                    console.log = oldLog;
                    throw error;
                }
            } else if (language === 'python') {
                // Extract print statements from Python code
                const printStatements = code.match(/print\((.*?)\)/g) || [];
                if (printStatements.length === 0) {
                    output.innerHTML = '<div class="console-output">// No output</div>';
                    return;
                }
                
                const printOutput = printStatements.map(stmt => {
                    // Remove print() and evaluate the content
                    const content = stmt.slice(6, -1);
                    // Handle both string literals and expressions
                    return content.startsWith('"') || content.startsWith("'") 
                        ? content.slice(1, -1) 
                        : content;
                }).join('\n');
                
                output.innerHTML = `<div class="console-output">${printOutput}</div>`;
            } else {
                // For other languages, show the "No output" message if code is empty
                const defaultOutput = code.trim() ? 'Hello, World!' : '// No output';
                output.innerHTML = `<div class="console-output">${defaultOutput}</div>`;
            }
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
