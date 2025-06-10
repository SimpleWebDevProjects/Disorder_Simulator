// DOM Elements
const dyslexiaToggle = document.getElementById('dyslexiaToggle');
const colorToggle = document.getElementById('colorToggle');
const colorFilter = document.getElementById('colorFilter');
const motorToggle = document.getElementById('motorToggle');
const tremorIntensity = document.getElementById('tremorIntensity');
const previewArea = document.getElementById('previewArea');
const previewContent = document.querySelector('.preview-content');
const infoBtn = document.querySelector('.info-btn');
const modal = document.querySelector('.modal');
const closeModal = document.querySelector('.close-modal');
const readContentBtn = document.getElementById('readContent');
const voiceButtons = document.querySelectorAll('.voice-btn');

// Screen Reader
let speech = null;
let currentVoiceSpeed = 1.0;

// Motor Impairment
let tremorCursor = null;
let tremorActive = false;

// Enhanced dyslexia effect
function applyDyslexiaEffect() {
    if (dyslexiaToggle.checked) {
        const paragraphs = previewContent.querySelectorAll('p, li, h4');

        paragraphs.forEach(p => {
            let newHTML = '';
            const text = p.textContent;

            // Split text into words
            const words = text.split(' ');

            words.forEach(word => {
                if (word.length > 3) {
                    // Scramble middle letters
                    const first = word[0];
                    const last = word[word.length - 1];
                    let middle = word.substring(1, word.length - 1);

                    // Scramble middle characters
                    middle = middle.split('').sort(() => Math.random() - 0.5).join('');

                    // Random rotation for each character
                    let scrambled = '';
                    for (let i = 0; i < word.length; i++) {
                        const rotation = (Math.random() * 10) - 5;
                        scrambled += `<span style="--rotation:${rotation}">${word[i]}</span>`;
                    }

                    newHTML += scrambled + ' ';
                } else {
                    newHTML += word + ' ';
                }
            });

            p.innerHTML = newHTML;
        });
    } else {
        // Reset to original text
        previewContent.innerHTML = `
            <p>Welcome to Empathy Lens. This tool helps you experience how people with different abilities interact with digital content.</p>

            <p>By toggling the options on the left, you can simulate various accessibility challenges:</p>

            <ul>
                <li><strong>Dyslexia simulation</strong> creates a jumbled text experience to help understand reading difficulties.</li>
                <li><strong>Color perception filters</strong> demonstrate how people with color vision deficiency see your content.</li>
                <li><strong>Motor control simulation</strong> demonstrates the challenges faced by users with limited motor skills.</li>
                <li><strong>Text-to-speech</strong> helps understand different comprehension speeds.</li>
            </ul>

            <div class="preview-examples">
                <div class="example-card">
                    <h4><i class="fas fa-exclamation-triangle"></i> Warning Alert</h4>
                    <p>This action cannot be undone. Proceed with caution.</p>
                    <button class="btn" style="background:linear-gradient(135deg, #ff9800, #ff5722);">
                        <i class="fas fa-trash"></i> Delete Item
                    </button>
                </div>

                <div class="example-card">
                    <h4><i class="fas fa-check-circle"></i> Success Message</h4>
                    <p>Your settings have been saved successfully!</p>
                    <button class="btn" style="background:linear-gradient(135deg, #4CAF50, #2E7D32);">
                        <i class="fas fa-check"></i> Continue
                    </button>
                </div>
            </div>

            <p>This tool was created to promote inclusive design practices. Remember that real accessibility goes beyond simulation - always test with real users when possible.</p>
        `;
    }
}

// Dyslexia Toggle
dyslexiaToggle.addEventListener('change', applyDyslexiaEffect);

// Color Blindness Toggle
colorToggle.addEventListener('change', () => {
    if (colorToggle.checked) {
        previewArea.classList.add(colorFilter.value);
    } else {
        previewArea.className = 'preview';
        if (dyslexiaToggle.checked) previewArea.classList.add('dyslexia-mode');
    }
});

colorFilter.addEventListener('change', () => {
    if (colorToggle.checked) {
        // Remove all filter classes
        previewArea.classList.remove('protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia');
        // Add the selected filter
        previewArea.classList.add(colorFilter.value);
    }
});

// Voice Speed Buttons
voiceButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        voiceButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentVoiceSpeed = parseFloat(btn.dataset.speed);
    });
});

// Text-to-Speech
readContentBtn.addEventListener('click', () => {
    const content = previewContent.innerText;

    if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        // Create new utterance
        const utterance = new SpeechSynthesisUtterance(content);
        utterance.rate = currentVoiceSpeed;

        // Speak the content
        window.speechSynthesis.speak(utterance);
    } else {
        alert('Web Speech API is not supported in your browser');
    }
});

// Motor Impairment
motorToggle.addEventListener('change', () => {
    tremorActive = motorToggle.checked;

    if (tremorActive) {
        // Create tremor cursor
        if (!tremorCursor) {
            tremorCursor = document.createElement('div');
            tremorCursor.classList.add('tremor-cursor');
            document.body.appendChild(tremorCursor);
            document.body.classList.add('motor-impairment');
        }

        // Show the custom cursor
        tremorCursor.style.display = 'block';

        // Add mouse movement listener
        document.addEventListener('mousemove', handleTremorMouseMove);
    } else {
        if (tremorCursor) {
            tremorCursor.style.display = 'none';
            document.body.classList.remove('motor-impairment');
        }
        document.removeEventListener('mousemove', handleTremorMouseMove);
    }
});

function handleTremorMouseMove(e) {
    if (!tremorActive || !tremorCursor) return;

    const intensity = parseInt(tremorIntensity.value);
    const tremorX = (Math.random() - 0.5) * intensity * 10;
    const tremorY = (Math.random() - 0.5) * intensity * 10;

    tremorCursor.style.left = `${e.pageX + tremorX}px`;
    tremorCursor.style.top = `${e.pageY + tremorY}px`;
}

// Modal functionality
infoBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Initialize with some effects for demo
window.addEventListener('DOMContentLoaded', () => {
    // Demo animation
    setTimeout(() => {
        dyslexiaToggle.checked = true;
        applyDyslexiaEffect();

        setTimeout(() => {
            dyslexiaToggle.checked = false;
            applyDyslexiaEffect();

            colorToggle.checked = true;
            colorFilter.value = 'deuteranopia';
            previewArea.classList.add('deuteranopia');

            setTimeout(() => {
                colorToggle.checked = false;
                previewArea.classList.remove('deuteranopia');
            }, 4000);
        }, 4000);
    }, 2000);
});
