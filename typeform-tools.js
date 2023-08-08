function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

var instapage_elements_object = insignia(instapage_elements, { deletion: true });

document.querySelector('#typeform-get-embed-code').addEventListener('click', function(event) {
    var typeform_embed_code = document.querySelector('#typeform-embed-code');

    var instapage_elements = instapage_elements_object.allValues();

    var typeform_id = document.getElementById('typeform_form_id').value;

    var typeform_options_size = document.getElementById('typeform_options_size').value;
    var typeform_options_sharegainstance = document.getElementById('typeform_options_sharegainstance').checked;
    var typeform_options_transitiveSearchParams = document.getElementById('typeform_options_transitiveSearchParams').checked;
    var typeform_options_autoload = document.getElementById('typeform_options_autoload').value;

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

    if (typeform_options_autoload != '') {
        typeform_options_list.push("open: 'time', openValue: " + typeform_options_autoload * 1000);
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

    typeform_embed_code.innerHTML = htmlEntities(embed_code);

    typeform_embed_code.style.display = 'block';
    document.getElementById('copy-embed-code').style.display = 'block';
});

document.getElementById('copy-embed-code').addEventListener('click', function(event) {

    var embed_code = document.getElementById('typeform-embed-code').textContent;
    const textArea = document.createElement('textarea');
    textArea.textContent = embed_code;
    document.body.append(textArea);
    textArea.select();
    document.execCommand("copy");
    textArea.remove();
});