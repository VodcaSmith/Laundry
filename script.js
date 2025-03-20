let resetButtonTimeout;

// Update harga berdasarkan jenis laundry dan berat
function updateHarga() {
  let jenis = parseInt(document.getElementById("jenis").value);
  let jumlahKg = parseFloat(document.getElementById("jumlah").value);
  
  if (jenis && jumlahKg) {
    let total = jenis * jumlahKg;
    let hargaMinimal = 12000;
    
    if (total < hargaMinimal) {
      document.getElementById("totalHarga").value = `Rp ${total.toLocaleString("id-ID")} (Minimal Rp 12,000)`;
    } else {
      document.getElementById("totalHarga").value = `Rp ${total.toLocaleString("id-ID")}`;
    }
  } else {
    document.getElementById("totalHarga").value = "";
  }
}

// Format nomor WhatsApp agar otomatis menjadi +62
function formatWhatsApp() {
  let input = document.getElementById("whatsapp");
  let nomor = input.value.replace(/\D/g, "");
  
  if (nomor.startsWith("08")) {
    input.value = "+62" + nomor.substring(1);
  }
}

// Mengirim data ke WhatsApp
function submitForm() {
  let nama = document.getElementById("name").value.trim();
  let tanggal = document.getElementById("tanggal").value; // Ambil dari input date
  let jenisLaundry = document.getElementById("jenis");
  let jenis = jenisLaundry.options[jenisLaundry.selectedIndex].text;
  let jumlahKg = document.getElementById("jumlah").value;
  let totalHarga = document.getElementById("totalHarga").value;
  let whatsappInput = document.getElementById("whatsapp");
  let nomorWA = whatsappInput.value.trim();
  let okeBtn = document.getElementById("okeBtn");
  
  // Format tanggal ke "dd/MM/yyyy"
  if (tanggal) {
    let dateObj = new Date(tanggal);
    let formattedTanggal = dateObj.getDate().toString().padStart(2, '0') + "/" +
      (dateObj.getMonth() + 1).toString().padStart(2, '0') + "/" +
      dateObj.getFullYear();
    tanggal = formattedTanggal;
  }
  
  // Validasi input
  if (!nama || !tanggal || !jumlahKg) {
    clearTimeout(resetButtonTimeout);
    let originalText = "Oke";
    okeBtn.style.background = "#ff4d4d";
    okeBtn.style.color = "#fff";
    okeBtn.innerText = "Harap isi semua data!";
    resetButtonTimeout = setTimeout(() => {
      okeBtn.style.background = "linear-gradient(45deg, #00A6FF, #0072FF)";
      okeBtn.innerText = originalText;
    }, 2000);
    return;
  }
  
  if (nomorWA) {
    formatWhatsApp();
    nomorWA = whatsappInput.value;
  }
  
  // Format pesan untuk WhatsApp
  let pesan = `
──────────────────────────  
                 KYRARA LAUNDRY     
    Perum Mutiara Biru Blok A No.17    
──────────────────────────  
Nama      : ${nama}  
Tanggal   : ${tanggal}  
Jenis       : ${jenis}  
Berat      : ${jumlahKg} kg  
Total        : ${totalHarga}  
──────────────────────────  
            Syarat dan Ketentuan  

- Batas Maksimal Pengambilan Pakaian 30 Hari Atau Pakaian Tidak Bisa Diambil (Akan Kami Buang)  

- Pelaporan Pakaian Hilang 1x24 Jam Atau Tidak Akan Kami Proses  
──────────────────────────  
Tunjukkan Pesan Ini Jika Nota Hilang Atau Lupa Saat Pengambilan Pakaian.  
──────────────────────────`;
  
  let urlWA = nomorWA ?
    `https://wa.me/${nomorWA.replace("+", "")}?text=${encodeURIComponent(pesan)}` :
    `https://wa.me/?text=${encodeURIComponent(pesan)}`;
  
  window.open(urlWA, "_blank");
}