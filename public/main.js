//QUESTION: is this simply to provide an example of authentication's impact on front end?
//I do not think that I need this file.


const token = localStorage.token;
if (token) {
    fetch('/api/auth/verify')
        .then(() => {
            // transitionToSignedIn();
        });
}

fetch('/api/breweries')
    .then(res => res.json())
    .then(loadBreweries);

function loadBreweries(breweries) {
    const fragment = document.createDocumentFragment();
    const addFragment = brewery => fragment.appendChild(brewery);

    breweries
        .map(createBrewery)
        .forEach(addFragment);

    addToList(fragment);
}

const ul = document.getElementById('breweries');
function addToList(node) {
    ul.appendChild(node);
}

const breweryTemplate = document.getElementById('breweryTemplate').content;
const getBoundNodes = ({ children: [li] }) => {
    const [span, button] = li.children;
    return { li, span, button };
};

function createBrewery(brewery) {
    const breweryFrag = breweryTemplate.cloneNode(true);
    const { li, span, button } = getBoundNodes(breweryFrag);

    span.textContent = `${brewery.name} at ${brewery.address ? brewery.address.city : 'nowhere'}`;
    button.addEventListener('click', () => {
        removeBrewery(brewery)
            .then(() => li.parentNode.removeChild(li));
    });

    return breweryFrag;
}

const error = document.getElementById('error');
const setError = (msg = '') => error.textContent = msg;
const resetError = () => setError();

function addBrwery(form) {
    resetError();
    const { name, neighborhood } = form.elements;
    const brewery = {
        name: name.value,
        neighborhood: neighborhood.value
    };

    const body = JSON.stringify(brewery);
    const method = 'POST';
    const headers = new Headers({
        'Content-Type': 'application/json',
        'Content-Length': body.length.toString()
    });

    fetch('/api/breweries', { method, body, headers })
        .then(res => {
            if (!res.ok) {
                return res.text().then(err => { throw err; });
            }
            return res.json();
        })
        .then(createBrewery)
        .then(addToList)
        .then(() => form.reset())
        .catch(setError);
}

function removeBrewery(brewery) {
    return fetch(`/api/stores/${brewery._id}`, { method: 'DELETE' })
        .then(res => {
            if (!res.ok) {
                res.text().then(err => { throw err; });
            }
        });
}



