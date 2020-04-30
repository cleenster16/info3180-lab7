/* Add your Application JavaScript */
Vue.component('app-header', {
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <a class="navbar-brand" href="#">Lab 7</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
            <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
            </li>
            <li class="nav-item">
            <router-link class="nav-link" to="/upload">Upload</router-link>
            </li>
        </ul>
      </div>
    </nav>
    `
});

Vue.component('app-footer', {
    template: `
    <footer>
        <div class="container">
            <p>Copyright &copy; Flask Inc.</p>
        </div>
    </footer>
    `
});

const Home = Vue.component('home', {
   template: `
    <div class="jumbotron">
        <h1>Lab 7</h1>
        <p class="lead">In this lab we will demonstrate VueJS working with Forms and Form Validation from Flask-WTF.</p>
    </div>
   `,
    data: function() {
       return {}
    }
});

const Upload = Vue.component('upload-form', {
    template: `
    <div class="form-control">
        <h1>Upload Photo</h1>
        <div v-if="message !== '' && message !== undefined" class="alert alert-success" role="alert">{{ message }}</div>
        <div v-else-if="errors.length !== 0" class="alert alert-danger" role="alert">
            <ul>
                <li v-for="error in errors">{{ error }}</li>
            </ul>
        </div>
        <form method="POST" id="uploadForm" @submit.prevent="uploadPhoto" enctype="multipart/form-data" class="">
            <div>
                <label for="description">Description</label>
                <textarea name="description" id="description"></textarea>
            </div>
            <div>
                <label for="photo">Photo</label>
                <input id="photo" type="file" name='photo'/>
            </div>
            <button class="btn btn-primary" my-4 type="submit" name="submit">Submit</button>
        </form>
    </div>
    `,
    methods: {
        uploadPhoto: function(){
            let self = this;
            let uploadForm = document.getElementById('uploadForm');
            let form_data = new FormData(uploadForm);

            self.message = "";
            self.errors = [];
            fetch("/api/upload", {
                method: 'POST',
                body : form_data,
                headers: {
                    'X-CSRFToken': token
                },
                credentials: 'same-origin'
            })
                .then(function (response) {
                    return response.json();
                })
                .then(function (jsonResponse) {
                    // display a success message
                    if (jsonResponse.errors) {
                        self.errors = jsonResponse.errors;
                    } else {
                        self.message = jsonResponse.message;
                    }
                    console.log(jsonResponse);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    },
    data: function() {
        return {
            message: '',
            errors: []
        }
    }

});

const NotFound = Vue.component('not-found', {
    template: `
    <div>
        <h1>404 - Not Found</h1>
    </div>
    `,
    data: function () {
        return {}
    }
})

// Define Routes
const router = new VueRouter({
    mode: 'history',
    routes: [
        {path: "/", component: Home},
        // Put other routes here
        {path: '/upload', component: Upload},
        // This is a catch all route in case none of the above matches
        {path: "*", component: NotFound}
    ]
});

// Instantiate our main Vue Instance
let app = new Vue({
    el: "#app",
    router
});