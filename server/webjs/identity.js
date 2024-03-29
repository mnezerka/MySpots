function Identity() {

    // call parent constructor
    Store.call(this)

    this.name = '';
    this.email = ''; 
    this.token = localStorage.getItem('token');
    this.isLogged = false;
}

// Identity is child of Store
Object.setPrototypeOf(Identity.prototype, Store.prototype);

Identity.prototype.logout = function() {
    console.log("UserProfile:logout:enter");
    localStorage.removeItem('token');
    this.isLogged = false;
    this.token = null;
    this.notifyAll();
}

Identity.prototype.fetchProfile = async function() {

    console.log("Identity:fetchProfile:enter");

    if (!this.token) {
        this.notifyAll();
        return;
    }

    try {
        const response = await fetch(host + "/profile", {
            method: 'GET',
            headers: {
                'Authorization': `JWT ${this.token}`
            },
            referrer: 'no-referrer'
        });

        if (response.ok) {
            const data = await response.json();
            
            console.log("fetchProfile:data", data);
            this.name = data.name;
            this.email = data.email;
            this.isLogged = true;
            this.notifyAll();
        } else {
            if (response.status == 401) {
                this.logout();
            } else {
                console.warn('Unexpected response code: ', response.status);
            }
        }
    } catch (err) {
        console.warn('Something went wrong.', err);
        app.errors.push('API call failed');
    }
}

Identity.prototype.login = async function(email, password) {

    console.log("UserProfile:login:enter", email, password);

    try {
        const response = await fetch(host + "/login", {
            method: 'POST',
            body: '{"email": "' + email + '", "password": "' + password + '"}',
            headers: {
                'Content-Type': 'application/json'
            },
            referrer: 'no-referrer'
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log("UserProfile:login:data", data);
            localStorage.setItem('token', data.accessToken)
            this.token= data.accessToken;
            this.isLogged = true;
            this.notifyAll();

            this.fetchProfile();
        } else {
            console.warn('Unexpected response code: ', response.status);
        }

    } catch (err) {
        console.warn('Something went wrong.', err);
    }
}
