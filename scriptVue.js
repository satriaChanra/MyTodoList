const app = Vue.createApp({
    data() {
        return {
            // State untuk halaman login atau register
            currentPage: 'login',
            isLoggedIn: false,

            // Data untuk login
            loginUsername: '',
            loginId: '',

            // Data untuk register
            registerUsername: '',
            registerId: '',

            // Data aktivitas pengguna
            startTime: '',
            endTime: '',
            newActivity: '',

            // Opsi waktu
            timeOptions: [
                "12:00 AM", "01:00 AM", "02:00 AM", "03:00 AM", "04:00 AM", "05:00 AM", "06:00 AM", "07:00 AM",
                "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
                "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM", "11:00 PM"
            ],

            // Data pengguna yang sedang login
            currentUser: null,

            // Variabel untuk mengedit
            editIndex: null
        };
    },
    computed: {
        // Validasi input apakah bisa menambah aktivitas
        canAdd() {
            return this.startTime && this.endTime && this.newActivity;
        }
    },
    methods: {
        // Fungsi untuk berpindah halaman login/register
        switchPage(page) {
            this.currentPage = page;
        },

        // Fungsi untuk register (buat akun)
        register() {
            if (this.registerUsername && this.registerId.toString().length >= 5) {
                let users = JSON.parse(localStorage.getItem('users')) || [];
                let userExists = users.find(user => user.username === this.registerUsername);

                if (userExists) {
                    // Menambahkan tiga angka acak jika nama sudah dipakai
                    let randomNumber = Math.floor(Math.random() * 900) + 100; // Generate angka dari 100 hingga 999
                    this.registerUsername = this.registerUsername + randomNumber;
                }

                users.push({
                    username: this.registerUsername,
                    id: this.registerId,
                    todos: []
                });
                localStorage.setItem('users', JSON.stringify(users));
                Swal.fire('Sukses', 'Akun berhasil dibuat!', 'success');
                this.switchPage('login');
            } else {
                Swal.fire('Error', 'Username atau ID kurang dari 5 digit!', 'error');
            }
        },

        // Fungsi untuk login
        login() {
            if (this.loginId.toString().length >= 5) {
                const users = JSON.parse(localStorage.getItem('users')) || [];
                const user = users.find(u => u.username === this.loginUsername && u.id === this.loginId);

                if (user) {
                    this.isLoggedIn = true;
                    this.currentUser = user;
                } else {
                    Swal.fire('Error', 'Username atau ID salah!', 'error');
                }
            } else {
                Swal.fire('Error', 'ID harus lebih dari 5 digit!', 'error');
            }
        },

        // Fungsi untuk menambah todo
        addTodoList() {
            if (this.canAdd) {
                const newTodo = {
                    text: this.newActivity,
                    start: this.startTime,
                    end: this.endTime,
                    done: false
                };
                this.currentUser.todos.push(newTodo);
                this.saveCurrentUser();
                this.startTime = this.endTime = this.newActivity = '';
            }
        },

        // Fungsi untuk menghapus todo dengan konfirmasi
        confirmDelete(id) {
            Swal.fire({
                title: 'Yakin ingin menghapus?',
                text: "Data ini akan dihapus secara permanen!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Ya, hapus!',
                cancelButtonText: 'Batal'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.deleteTodoList(id);
                    Swal.fire(
                        'Terhapus!',
                        'Aktivitas telah berhasil dihapus.',
                        'success'
                    );
                }
            });
        },

        // Fungsi untuk menghapus todo
        deleteTodoList(id) {
            this.currentUser.todos.splice(id, 1);
            this.saveCurrentUser();
        },

        // Fungsi untuk menandai selesai atau belum
        toggleDone(id) {
            this.currentUser.todos[id].done = !this.currentUser.todos[id].done;
            this.saveCurrentUser();
        },

        // Fungsi untuk mengedit todo
        editTodoList(id) {
            const item = this.currentUser.todos[id];
            Swal.fire({
                title: 'Edit Aktivitas',
                html: `<input type="text" id="swal-input1" class="swal2-input" value="${item.start}">
                       <input type="text" id="swal-input2" class="swal2-input" value="${item.end}">
                       <input type="text" id="swal-input3" class="swal2-input" value="${item.text}">`,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: 'Simpan',
                cancelButtonText: 'Batal',
                preConfirm: () => {
                    const start = document.getElementById('swal-input1').value;
                    const end = document.getElementById('swal-input2').value;
                    const text = document.getElementById('swal-input3').value;
                    return { start, end, text }
                }
            }).then((result) => {
                if (result.isConfirmed && result.value) {
                    this.currentUser.todos[id].start = result.value.start;
                    this.currentUser.todos[id].end = result.value.end;
                    this.currentUser.todos[id].text = result.value.text;
                    this.saveCurrentUser();
                    Swal.fire('Sukses!', 'Aktivitas berhasil diperbarui.', 'success');
                }
            });
        },

        // Fungsi untuk menyimpan data pengguna ke LocalStorage
        saveCurrentUser() {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userIndex = users.findIndex(u => u.username === this.currentUser.username && u.id === this.currentUser.id);
            if (userIndex !== -1) {
                users[userIndex] = this.currentUser;
                localStorage.setItem('users', JSON.stringify(users));
            }
        },

        // Fungsi untuk logout
        logout() {
            this.isLoggedIn = false;
            this.currentUser = null;
            this.loginUsername = '';
            this.loginId = '';
        }
    },
    mounted() {
        // Mengambil data dari LocalStorage jika pengguna sudah pernah login
        const savedUser = JSON.parse(localStorage.getItem('currentUser'));
        if (savedUser) {
            this.isLoggedIn = true;
            this.currentUser = savedUser;
        }
    },
    watch: {
        // Menyimpan data pengguna yang sedang login ke LocalStorage
        currentUser(newUser) {
            if (newUser) {
                localStorage.setItem('currentUser', JSON.stringify(newUser));
            } else {
                localStorage.removeItem('currentUser');
            }
        }
    }
});

app.mount("#app");