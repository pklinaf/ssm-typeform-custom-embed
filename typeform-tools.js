// function htmlEntities(str) {
//     return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// }

var instapage_elements_object = insignia(instapage_elements, { deletion: true });

document.getElementById('typeform-reset').addEventListener('click', function(event) {
    document.getElementById('typeform_form_id').value = '';
    instapage_elements_object.destroy();
    instapage_elements_object = insignia(instapage_elements, { deletion: true });
    document.getElementById('typeform_options_size').value = '';
    document.getElementById('typeform_options_sharegainstance').checked = true;
    document.getElementById('typeform_options_transitiveSearchParams').checked = true
    document.getElementById('typeform_options_launch_options').selectedIndex = 0;
    document.getElementById('autoload-panel').style.display = 'none';
    document.getElementById('typeform_options_launch_options_time').value = '';
    document.getElementById('typeform_form_id').style.border = 'none';
    document.getElementById('typeform_options_launch_options_time').style.border = 'none';
});

document.getElementById('typeform_options_launch_options').addEventListener('change', function(event) {
    if (this.value == 'time') {
        document.getElementById('autoload-panel').style.display = 'block';
    }
    else {
        document.getElementById('autoload-panel').style.display = 'none';
    }
});

document.querySelector('#typeform-get-embed-code').addEventListener('click', function(event) {
    var typeform_embed_code = document.querySelector('#typeform-embed-code');

    var instapage_elements = instapage_elements_object.allValues();

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

    typeform_options = typeform_options_list.join(', ');

    var embed_code = `<script src="//embed.typeform.com/next/embed.js"></script>
<link rel="stylesheet" href="//embed.typeform.com/next/css/popup.css" />
<script>
  const { open, close, toggle, refresh } = window.tf.createPopup('${typeform_id}', {${typeform_options}})
`
    for (var i = 0; i < instapage_elements.length; i++) {
        var typeform_element_id = instapage_elements[i];
        embed_code += `  document.querySelector('#${typeform_element_id}').onclick = toggle
`
    }

    embed_code += '</script>';

    // typeform_embed_code.innerHTML = htmlEntities(embed_code);

    document.getElementById('typeform-embed-code-area').innerHTML = embed_code;
    document.getElementById('typeform-embed-code-area').style.display = 'block';

    document.getElementById('copy-embed-code').style.display = 'block';
});

document.getElementById('copy-embed-code').addEventListener('click', function(event) {

    document.getElementById('typeform-embed-code-area').select();
    document.execCommand("copy");
});
