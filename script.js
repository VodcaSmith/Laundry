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
  
// Fungsi untuk menghitung estimasi waktu selesai dalam rentang tanggal  
function updateEstimasiWaktu() {  
  let jenisLaundry = parseInt(document.getElementById("jenis").value);  
  let tanggalInput = document.getElementById("tanggal").value;  
  
  document.getElementById("estimasiWaktu").value = "";  
  
  if (!tanggalInput) {  
    document.getElementById("estimasiWaktu").value = "Pilih tanggal terlebih dahulu";  
    return;  
  }  
  
  let tanggalMasuk = new Date(tanggalInput);  
  if (isNaN(tanggalMasuk.getTime())) {  
    document.getElementById("estimasiWaktu").value = "Tanggal tidak valid";  
    return;  
  }  
  
  let minHari = 0, maxHari = 0;  
  
  switch (jenisLaundry) {  
    case 4000:  // Seterika (2-3 hari)  
      minHari = 1;  
      maxHari = 2;  
      break;  
    case 6000:  // Pakaian (1-2 hari)  
      minHari = 2;  
      maxHari = 3;  
      break;  
    case 7000:  // Selimut (3-4 hari)  
      minHari = 3;  
      maxHari = 4;  
      break;
    case 8000: // Bedcover (4-5 hari)  
      minHari = 4;
      maxHari = 5;
      break;  
    case 10000: // Express (1 hari)  
      minHari = 1;  
      maxHari = 1;  
      break;  
    default:  
      document.getElementById("estimasiWaktu").value = "Jenis laundry tidak valid";  
      return;  
  }  
  
  let tanggalMin = new Date(tanggalMasuk);  
  let tanggalMax = new Date(tanggalMasuk);  
  tanggalMin.setDate(tanggalMin.getDate() + minHari);  
  tanggalMax.setDate(tanggalMax.getDate() + maxHari);  
  
  let formatTanggal = (date) => date.getDate().toString().padStart(2, '0') + "/" +  
    (date.getMonth() + 1).toString().padStart(2, '0') + "/" +  
    date.getFullYear();  
  
  let estimasiText = (minHari === maxHari)   
    ? formatTanggal(tanggalMin)    
    : `${formatTanggal(tanggalMin)} - ${formatTanggal(tanggalMax)}`;  
  
  document.getElementById("estimasiWaktu").value = estimasiText;  
}  
  
// Event Listener  
document.getElementById("tanggal").addEventListener("change", updateEstimasiWaktu);  
document.getElementById("jenis").addEventListener("change", updateEstimasiWaktu);  
  
// Mengirim data ke WhatsApp  
function submitForm() {  
  let nama = document.getElementById("name").value.trim();  
  let tanggal = document.getElementById("tanggal").value;  
  let jenisLaundry = document.getElementById("jenis");  
  let jenis = jenisLaundry.options[jenisLaundry.selectedIndex].text;  
  let jumlahKg = document.getElementById("jumlah").value;  
  let totalHarga = document.getElementById("totalHarga").value;  
  let estimasiWaktu = document.getElementById("estimasiWaktu").value;  
  let whatsappInput = document.getElementById("whatsapp");  
  let nomorWA = whatsappInput.value.trim();  
  let okeBtn = document.getElementById("okeBtn");  
    
  if (tanggal) {  
    let dateObj = new Date(tanggal);  
    let formattedTanggal = dateObj.getDate().toString().padStart(2, '0') + "/" +  
      (dateObj.getMonth() + 1).toString().padStart(2, '0') + "/" +  
      dateObj.getFullYear();  
    tanggal = formattedTanggal;  
  }  
    
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
Estimasi Selesai : ${estimasiWaktu}    
──────────────────────────    
            Syarat dan Ketentuan    
  
- Batas Maksimal Pengambilan Pakaian 30 Hari Atau Pakaian Tidak Bisa Diambil (Akan Kami Buang)    
  
- Pelaporan Pakaian Hilang 1x24 Jam Atau Tidak Akan Kami Proses    
  
- Estimasi waktu selesai hanya perkiraan. Pakaian dapat selesai lebih cepat atau lebih lambat tergantung kondisi.    
  
- Express Laundry akan selesai dalam waktu 24 jam dari tanggal masuk, kecuali terjadi kendala teknis.    
──────────────────────────    
Tunjukkan Pesan Ini Jika Nota Hilang Atau Lupa Saat Pengambilan Pakaian.    
──────────────────────────`;  
    
  let urlWA = nomorWA ?  
    `https://wa.me/${nomorWA.replace("+", "")}?text=${encodeURIComponent(pesan)}` :  
    `https://wa.me/?text=${encodeURIComponent(pesan)}`;  
    
  window.open(urlWA, "_blank");  
}
