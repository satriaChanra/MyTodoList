const app = Vue.createApp({
  data() {
      return {
          // Database aktivitas
          database: [
              { text: "Belajar HTML", start: "07:00 AM", end: "08:00 AM", done: false },
              { text: "Belajar CSS", start: "08:00 AM", end: "09:00 AM", done: false }
          ],

          // v-model untuk input
          startTime: "",
          endTime: "",
          newActivity: "",

          // Waktu dalam format jam 12:00 AM hingga 11:00 PM
          timeOptions: [
              "12:00 AM", "01:00 AM", "02:00 AM", "03:00 AM", "04:00 AM", "05:00 AM", "06:00 AM", "07:00 AM",
              "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
              "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM", "11:00 PM"
          ],

          // Variabel untuk edit
          editIndex: null,
          editStartTime: "",
          editEndTime: "",
          editActivity: ""
      };
  },
  computed: {
      // Validasi input apakah bisa menambah aktivitas
      canAdd() {
          return this.startTime && this.endTime && this.newActivity;
      }
  },
  methods: {
      // Fungsi untuk menambahkan aktivitas baru
      addTodoList() {
          if (this.canAdd) {
              const newTodo = {
                  text: this.newActivity,
                  start: this.startTime,
                  end: this.endTime,
                  done: false
              };
              this.database.push(newTodo);

              // Kosongkan input setelah menambah
              this.startTime = this.endTime = this.newActivity = '';

              // Tampilkan SweetAlert2 setelah menambah aktivitas
              Swal.fire({
                  title: 'Berhasil!',
                  html: `
                      <strong>Waktu Mulai:</strong> ${newTodo.start}<br>
                      <strong>Waktu Selesai:</strong> ${newTodo.end}<br>
                      <strong>Aktivitas:</strong> ${newTodo.text}
                  `,
                  icon: 'success',
                  confirmButtonText: 'OK',
                  confirmButtonColor: '#007bff',
                  background: '#f8f9fa',
                  color: '#343a40',
                  showClass: {
                      popup: 'animate__animated animate__fadeInDown'
                  },
                  hideClass: {
                      popup: 'animate__animated animate__fadeOutUp'
                  }
              });
          }
      },
      // Fungsi untuk menghapus aktivitas
      confirmDelete(id) {
          Swal.fire({
              title: 'Apakah Anda yakin?',
              text: "Anda tidak dapat mengembalikan ini!",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#d33',
              cancelButtonColor: '#3085d6',
              confirmButtonText: 'Ya, hapus!',
              cancelButtonText: 'Batal'
          }).then((result) => {
              if (result.isConfirmed) {
                  this.database.splice(id, 1);
                  Swal.fire(
                      'Dihapus!',
                      'Aktivitas telah dihapus.',
                      'success'
                  );
              }
          });
      },
      // Fungsi untuk menandai selesai atau tidak
      tandaiFinish(id) {
          this.database[id].done = !this.database[id].done;
      },
      // Fungsi untuk membuka modal edit
      editTodoList(id) {
          const item = this.database[id];
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
                  this.database[id].start = result.value.start;
                  this.database[id].end = result.value.end;
                  this.database[id].text = result.value.text;
                  Swal.fire('Sukses!', 'Aktivitas berhasil diperbarui.', 'success');
              }
          });
      }
  }
});

app.mount("#app");