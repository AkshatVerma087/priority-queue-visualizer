from django.shortcuts import render,redirect,HttpResponse
from .models import Patient
from django.utils import timezone
import json
from django.http import JsonResponse
from .utils.priority_queue import hospitalqueue
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone

q = hospitalqueue()
# q.reset(Patient.objects.all())


def homePage(req):
    return render(req,'home.html')

@csrf_exempt

@csrf_exempt
def insert(req):
    if req.method == 'POST':
        try:
            data = json.loads(req.body)

            name = data.get('name')
            severity = data.get('severity')

            if not name or not severity:
                return JsonResponse({'error': 'Missing name or severity'}, status=400)

            try:
                severity = int(severity)
            except ValueError:
                return JsonResponse({'error': 'Severity must be an integer'}, status=400)

            
           
            p = Patient.objects.create(name=name, severity=severity, admit_time=timezone.now())

            # Insert into queue
            q.insert(p)

            return JsonResponse({'message': 'Patient added successfully'})

        except Exception as e:
            print("Insert Error:", str(e)) 
            return JsonResponse({'error': f'Unexpected error: {str(e)}'}, status=500)

    return JsonResponse({'error': 'GET not allowed on this endpoint'}, status=405)

@csrf_exempt
def delete_patient(req):
    if req.method == 'POST':
        # remove from queue
        removed = q.delete()

        if removed:
            # remove from db
            removed.delete()
            return JsonResponse({'message' : f'{removed.name} removed'})
        else:
            return JsonResponse({'error' : "No patients to remove"})
    
    return render(req,'home.html')

def get_queue(req):
    patients = q.display()

    data = [
        {
        'id' : p.id,
        'name' : p.name,
        'severity' : p.severity,
        'admit_time' : p.admit_time.strftime('%Y-%m-%d %H:%M:%S')
        }

        for p in patients
        ]

    return JsonResponse({'queue' : data})