document.addEventListener('DOMContentLoaded', () => {
    // Initialize Ace Editor with specific settings
    const editor = ace.edit("editor", {
        theme: "ace/theme/monokai",
        mode: "ace/mode/javascript",
        fontSize: 14,
        showPrintMargin: false,
        showGutter: true,
        highlightActiveLine: true,
        wrap: true,
        useSoftTabs: true,
        tabSize: 2
    });

    // Ensure editor resizes correctly
    editor.container.style.height = '100%';
    editor.container.style.width = '100%';
    editor.resize();

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

    // Theme adaptation
    const updateEditorTheme = () => {
        const isDark = document.body.classList.contains('dark-theme');
        editor.setTheme(isDark ? "ace/theme/twilight" : "ace/theme/chrome");
    };

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                updateEditorTheme();
            }
        });
    });

    observer.observe(document.body, { attributes: true });

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
