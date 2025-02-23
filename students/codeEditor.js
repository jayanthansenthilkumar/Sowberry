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
        
        // Simulate code execution (replace with actual backend integration)
        setTimeout(() => {
            try {
                let result;
                if (language === 'javascript') {
                    // For JavaScript, we can actually run it
                    const oldLog = console.log;
                    const logs = [];
                    console.log = (...args) => logs.push(args.join(' '));
                    
                    try {
                        result = eval(code);
                        console.log = oldLog;
                        output.innerHTML = `<div class="console-output">${logs.join('\n')}${result !== undefined ? '\n' + result : ''}</div>`;
                    } catch (error) {
                        console.log = oldLog;
                        throw error;
                    }
                } else {
                    // For other languages, show a simulation message
                    output.innerHTML = `<div class="console-output">Code execution simulation for ${language}:\nHello, World!</div>`;
                }
            } catch (error) {
                output.innerHTML = `<div class="console-output error">Error: ${error.message}</div>`;
            }
        }, 500);
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
});
