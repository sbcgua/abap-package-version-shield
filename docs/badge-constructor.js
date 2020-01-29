/*global document*/

function onSubmit() {
    const repoPath = document.querySelector("#constructorForm [name='repo_path']");
    const filePath = document.querySelector("#constructorForm [name='file_path']");
    const constName = document.querySelector("#constructorForm [name='const_name']");
    const result = document.getElementById('constructorResult');

    const validations = [
        [repoPath, /^\w+\/\w+$/, 'Repo path must be owner/reponame, e.g. "sbcgua/mockup_loader"'],
        [filePath, /^[-_.,A-Za-z0-9]+(\/[-_.,A-Za-z0-9]+)*$/, 'Incorrect file path, e.g. "src/zif_mockup_loader_constants.intf.abap"'],
        [constName, /^(\w+)?$/, 'Incorrect constant name, e.g. "version" (or empty)'],
    ];

    for (const [input, regex, msg] of validations) {
        if (!regex.test(input.value)) {
            input.classList.add('error-input');
            result.classList.add('error-result');
            result.classList.remove('ok-result');
            result.innerText = msg;
            return;
        } else {
            input.classList.remove('error-input');
        }
    }

    result.classList.remove('error-result');
    result.classList.add('ok-result');
    result.innerText = `https://img.shields.io/endpoint?url=https://shield.abap.space/version-shield-json/github/${repoPath.value}/${filePath.value}${ constName.value ? '/' + constName.value : '' }`;
}

function initForm() {
    document.getElementById('constructorSubmit').onclick = onSubmit;
}

initForm();
