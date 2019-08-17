from django.shortcuts import render


def index(request):
	return render(request, 'reconocimiento/reconocimiento.html', {}) 

def takePhoto(request):
	return render(request, 'reconocimiento/tomarFoto.html', {})

def identificar(request):
	print(request)
	from PIL import Image
	from io import BytesIO
	import base64
	from django.http import HttpResponse
	from django.http import JsonResponse

	import os
	
	#with open('some/file/name.txt', 'wb+') as destination:
		#for chunk in f.chunks():
			#destination.write(chunk)
	img = request.POST['imagen']

	data = img.split(',')[1]
	if data:
		#Imagen que se le enviara la ruta y devolvera el resultado...
		urlImagenAProcesas = 'a_reconocer.png'

		im = save(data)
		#OpenCV module
		import cv2
		#Modulo para leer directorios y rutas de archivos
		import os
		#OpenCV trabaja con arreglos de numpy
		import numpy
		# Parte 1: Creando el entrenamiento del modelo
		print('Esta Procesando, wey!!!...')

		#Directorio donde se encuentran las carpetas con las caras de entrenamiento
		dir_faces = 'att_faces/orl_faces'

		#Tamaño para reducir a miniaturas las fotografias
		size = 4

		# Crear una lista de imagenes y una lista de nombres correspondientes
		nombrecapturado = ""
		(images, lables, names, id) = ([], [], {}, 0)
		for (subdirs, dirs, files) in os.walk(dir_faces):
			for subdir in dirs:
				names[id] = subdir
				subjectpath = os.path.join(dir_faces, subdir)
				for filename in os.listdir(subjectpath):
					path = subjectpath + '/' + filename
					lable = id
					images.append(cv2.imread(path, 0))
					lables.append(int(lable))
				id += 1
			print(dirs)
		(im_width, im_height) = (112, 92)

		# Crear una matriz Numpy de las dos listas anteriores
		(images, lables) = [numpy.array(lis) for lis in [images, lables]]
		# OpenCV entrena un modelo a partir de las imagenes
		model = cv2.face.LBPHFaceRecognizer_create()
		model.train(images, lables)

		# Parte 2: Utilizar el modelo entrenado en funcionamiento con la camara
		face_cascade = cv2.CascadeClassifier( 'haarcascade_frontalface_default.xml')
		#convertimos la imagen a blanco y negro    
		gray = im
		#redimensionar la imagen
		mini = cv2.resize(gray, (int(gray.shape[1] / size), int(gray.shape[0] / size)))
		"""buscamos las coordenadas de los rostros (si los hay) y
		guardamos su posicion"""
		faces = face_cascade.detectMultiScale(mini)
		for i in range(len(faces)):
			face_i = faces[i]
			(x, y, w, h) = [v * size for v in face_i]
			face = gray[y:y + h, x:x + w]
			face_resize = cv2.resize(face, (im_width, im_height))
			prediction = model.predict(face_resize)
			cara = '%s' % (names[prediction[0]])
			if prediction[1]<100 :
				return JsonResponse({'face_id': cara })
				# return HttpResponse(cara)
			elif prediction[1]>101 and prediction[1]<500:           
				return HttpResponse("-1")
	return HttpResponse("-1")


def save(encoded_data):
	import base64
	import cv2
	from io import BytesIO
	from PIL import Image

	import numpy as np
	imgdata = base64.b64decode(encoded_data)
	image = Image.open(BytesIO(imgdata))
	rt = cv2.cvtColor(np.array(image), cv2.COLOR_BGR2GRAY)
	return rt

def registerPhotos(request):
	from django.http import HttpResponse
	from django.http import JsonResponse
	
	from PIL import Image
	#OpenCV module
	import cv2
	#Modulo para leer directorios y rutas de archivos
	import os
	#OpenCV trabaja con arreglos de numpy
	import numpy
	#Obtener el nombre de la persona que estamos capturando
	import sys
	import shutil

	print("Inicio")
	if(request.method == 'POST'):
		if request.POST.get('id'):
			nombre = request.POST['id']
			#Directorio donde se encuentra la carpeta con el nombre de la persona
			dir_faces = 'att_faces/orl_faces'
			path = os.path.join(dir_faces, nombre)
			
			if(request.POST['face_data']):
				face_data = request.POST['face_data']
				if face_data.strip() != '':
					if (os.path.exists(dir_faces+"/"+face_data)):
						shutil.rmtree(os.path.join(dir_faces, face_data))		
			#Tamaño para reducir a miniaturas las fotografias
			size = 4
			#Si no hay una carpeta con el nombre ingresado entonces se crea
			if not os.path.isdir(path):
			    os.mkdir(path)
			#cargamos la plantilla e inicializamos la webcam
			face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
			img_width, img_height = 112, 92
			#Ciclo para tomar fotografias
			co = -1
			for i in range(0,100):
				co = co + 1
				foto = 'foto%s' % (co)
				if request.POST.get(foto):
					print("Subida: " + foto)
					img = request.POST[foto]
					#convertimos la imagen a blanco y negro

					gray = save(img.split(',')[1]);

					#redimensionar la imagen
					mini = cv2.resize(gray, (int(gray.shape[1] / size), int(gray.shape[0] / size)))

					"""buscamos las coordenadas de los rostros (si los hay) y
					guardamos su posicion"""
					
					faces = face_cascade.detectMultiScale(mini)    
					faces = sorted(faces, key=lambda x: x[3])
					if faces:

						face_i = faces[0]
						(x, y, w, h) = [v * size for v in face_i]
						face = gray[y:y + h, x:x + w]
						face_resize = cv2.resize(face, (img_width, img_height))
						#El nombre de cada foto es el numero del ciclo
						#Obtenemos el nombre de la foto
						#Despues de la ultima sumamos 1 para continuar con los demas nombres
						pin=sorted([int(n[:n.find('.')]) for n in os.listdir(path) if n[0]!='.' ]+[0])[-1] + 1
						#Metemos la foto en el directorio
						cv2.imwrite('%s/%s.png' % (path, pin), face_resize)
					
			return JsonResponse({ "ok": True, "id": nombre })
	return HttpResponse("-1")