function submitData(){
	let name = document.getElementById('name').value
	let email = document.getElementById('email').value
	let phonenumber = document.getElementById('phonenumber').value
	let subject = document.getElementById('subject').value
	let messege = document.getElementById('messege').value

	if (name == '' || email == '' || phonenumber == '' || messege == ''){
		return alert('Tolong isilah semua data')
	}

	let emailReceiver = 'sansinochi@gmail.com'
	let anchor = document.createElement('a')
	anchor.href = `mailto:${emailReceiver}?subject=${subject}&body=Halo my name ${name}, ${messege}`
	anchor.click()

	/* console.log(name)
	console.log(email)
	console.log(phonenumber)
	console.log(subject)
	console.log(messege) */

	// object

	let dataObject = {
		nama : name,
		email : email,
		nohp : phonenumber,
		subject : subject,
		messege : messege
	}

	console.log(dataObject);

}

/* let nama = 'Ahsan'
let umur = 23
let email = 'maulanaahsancom@gmail.com'

let allData = 'Nama :'+nama+', Umur :'+umur+', Email :'+email
let allData2 = `

Nama : ${nama} 
Umur : ${umur}
Email : ${email}

`;

alert(allData2)

function getData(){
	console.log(allData2)
}

getData()

function penjumlahan (bil1, bil2){
	hasil = bil1 * bil2
	console.log(hasil)
}

penjumlahan(22,11) */

	/* if (name == ''){
		alert('Form name harus di isi')
	}

	if (email == ''){
		alert('Form email harus di isi')
	}

	if (phonenumber == ''){
		alert('Form phonenumber harus di isi')
	}

	if (subject == ''){
		alert('Form alamat harus di isi')
	} */