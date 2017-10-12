import serial
import time
import urllib2
import json
try:
	ser=serial.Serial(
		port='/dev/ttyUSB0',\
			baudrate=9600,\
			parity=serial.PARITY_NONE,\
			stopbits=serial.STOPBITS_ONE,\
			bytesize=serial.EIGHTBITS,\
				timeout=0)
except serial.SerialException,e:
	print "Exception occured while connecting to the port ".str(e)
except Exception:
	print "General exception occured"
print("connected to: " + ser.portstr)


data=""
try:
	while True:
			bytesToRead = ser.inWaiting()
			data = ser.read(24)
			ser.flushInput()
			dtag = data.encode('hex')


			while len(dtag)>=40:
					i=dtag.index("ccffff10")
					if len(dtag) -i>=40:
						temp=dtag[i+14:1+40-3]
						dtag=dtag[i+40:len(dtag)]
						print temp
					try:
						response=json.load( urllib2.urlopen("http://192.168.3.14:10039/AMSAssetTracker/rest/push/assetTrackingDetails?rfid="+temp+"&doorNo=1"))

						if response["responseType"]=="success":
							print reponse["message"]
						elif response["responseType"]=="error":
							print response["message"]
						else:
							print "Some error has occurred"
					except urllib2.HTTPError, e:
						print str(e)
					except urllib2.URLError, e:
						print str(e)
					except Exception:
						print str("GENERIC EXCEPTION")

			time.sleep(1)

except Exception:
	print "Generic exception"
ser.close()