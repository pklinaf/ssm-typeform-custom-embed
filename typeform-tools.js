document.getElementById('typeform_options_launch_options').addEventListener('change', function(event) {
    if (this.value == 'time') {
        document.getElementById('autoload-panel').style.display = 'block';
    }
    else {
        document.getElementById('autoload-panel').style.display = 'none';
    }
});

// Hidden values storage
var hiddenValues = {};

// Add hidden value
document.getElementById('add-hidden-value').addEventListener('click', function() {
    var name = document.getElementById('hidden-name').value.trim();
    var value = document.getElementById('hidden-value').value.trim();
    if (!name) return;

    hiddenValues[name] = value;

    updateHiddenValuesList();
    document.getElementById('hidden-name').value = '';
    document.getElementById('hidden-value').value = '';
});

// Remove hidden value
function updateHiddenValuesList() {
    var ul = document.getElementById('hidden-values-list');
    ul.innerHTML = '';
    Object.keys(hiddenValues).forEach(function(key) {
        var li = document.createElement('li');
        li.textContent = key + ': ' + hiddenValues[key];
        var btn = document.createElement('button');
        btn.textContent = 'Remove';
        btn.style.marginLeft = '10px';
        btn.onclick = function() {
            delete hiddenValues[key];
            updateHiddenValuesList();
        };
        li.appendChild(btn);
        ul.appendChild(li);
    });
}

// Trigger elements storage
var triggerElements = [];

// Handle input and tag creation
var input = document.getElementById('trigger-elements-input');
var tagsContainer = document.getElementById('trigger-elements-tags');

input.addEventListener('keydown', function(e) {
    if (e.key === ' ' && input.value.trim() !== '') {
        e.preventDefault();
        addTriggerElement(input.value.trim());
        input.value = '';
    }
});

function addTriggerElement(value) {
    if (!triggerElements.includes(value)) {
        triggerElements.push(value);
        renderTriggerElements();
    }
}

function removeTriggerElement(value) {
    triggerElements = triggerElements.filter(v => v !== value);
    renderTriggerElements();
}

function renderTriggerElements() {
    tagsContainer.innerHTML = '';
    triggerElements.forEach(function(tag) {
        var span = document.createElement('span');
        span.textContent = tag;
        span.className = 'tag';
        var btn = document.createElement('button');
        btn.textContent = '×';
        btn.onclick = function() { removeTriggerElement(tag); };
        span.appendChild(btn);
        tagsContainer.appendChild(span);
    });
}

document.querySelector('#typeform-get-embed-code').addEventListener('click', function(event) {

    var typeform_id = document.getElementById('typeform_form_id').value;
    if (typeform_id == '') {
        alert('A Form ID is required!');
        document.getElementById('typeform_form_id').focus();
        document.getElementById('typeform_form_id').style.border = 'thick solid red';
        return false;
    }

    var typeform_options_size = document.getElementById('typeform_options_size').value;
    var typeform_options_sharegainstance = document.getElementById('typeform_options_sharegainstance').checked;
    var typeform_options_transitiveSearchParams = document.getElementById('typeform_options_transitiveSearchParams').checked;
    var typeform_options_launch_options = document.getElementById('typeform_options_launch_options').value;

    var typeform_options = '';
    var typeform_options_list = [];

    if (typeform_options_size != '') {
        typeform_options_list.push('size: ' + typeform_options_size);
    }

    if (typeform_options_sharegainstance) {
        typeform_options_list.push('shareGaInstance: true');
    }

    if (typeform_options_transitiveSearchParams) {
        typeform_options_list.push('transitiveSearchParams: true');
    }

    if (typeform_options_launch_options == 'page') {
        typeform_options_list.push("open: 'load'");
    }
    else if (typeform_options_launch_options == 'time') {
        var seconds = document.getElementById('typeform_options_launch_options_time').value;
        if (seconds == '') {
            alert('You need to set a time in seconds!');
            document.getElementById('typeform_options_launch_options_time').focus();
            document.getElementById('typeform_options_launch_options_time').style.border = 'thick solid red';
            return false;
        }
        else {
            typeform_options_list.push("open: 'time', openValue: " + seconds * 1000);
        }
    }

    // Add hidden values if any
    if (Object.keys(hiddenValues).length > 0) {
        var hiddenStr = Object.entries(hiddenValues)
            .map(([k, v]) => {
                // Add single quotes to value only if it contains spaces
                const value = /\s/.test(v) ? `'${v}'` : v;
                return `${k}: ${value}`;
            })
            .join(', ');
        typeform_options_list.push(`hidden: {${hiddenStr}}`);
    }

    typeform_options = typeform_options_list.join(', ');

    var embed_code = `<script src="//embed.typeform.com/next/embed.js"></script>
<link rel="stylesheet" href="//embed.typeform.com/next/css/popup.css" />
<script>
  const { open, close, toggle, refresh } = window.tf.createPopup('${typeform_id}', {${typeform_options}})
`
    for (var i = 0; i < triggerElements.length; i++) {
        var typeform_element_id = triggerElements[i];
        embed_code += `  document.querySelector('#${typeform_element_id}').onclick = toggle
`
    }

    embed_code += '</script>';

    document.getElementById('typeform-embed-code-area').innerHTML = embed_code;
    document.getElementById('typeform-embed-code-area').style.display = 'block';

    document.getElementById('copy-embed-code').style.display = 'block';
});

document.getElementById('copy-embed-code').addEventListener('click', function(event) {

    document.getElementById('typeform-embed-code-area').select();
    document.execCommand("copy");
});

document.getElementById('typeform-reset').addEventListener('click', function(event) {
    document.getElementById('typeform_form_id').value = '';

    document.getElementById('typeform_options_size').value = '';
    document.getElementById('typeform_options_sharegainstance').checked = true;
    document.getElementById('typeform_options_transitiveSearchParams').checked = true
    document.getElementById('typeform_options_launch_options').selectedIndex = 0;
    document.getElementById('autoload-panel').style.display = 'none';
    document.getElementById('typeform_options_launch_options_time').value = '';
    document.getElementById('typeform_form_id').style.border = 'none';
    document.getElementById('typeform_options_launch_options_time').style.border = 'none';

    document.getElementById('typeform-embed-code-area').innerHTML = '';
    document.getElementById('typeform-embed-code-area').style.display = 'none';
    document.getElementById('copy-embed-code').style.display = 'none';

    hiddenValues = {};
    updateHiddenValuesList();
    
    triggerElements = [];
    renderTriggerElements();
});