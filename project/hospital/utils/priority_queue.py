import heapq

class hospitalqueue:
    def __init__(self):
        self.queue = []
        self.counter = 0

    def insert(self,obj):
        heapq.heappush(self.queue,(-obj.severity,obj.admit_time,self.counter,obj))
        self.counter += 1

    def delete(self):
        if self.queue:
            return heapq.heappop(self)[3]
        
    def display(self,limit = 10):
        return [entry[3] for entry in sorted(self.queue)[:limit]]

    def reset(self, all_patients):
        self.queue.clear()
        self.counter = 0
        for patient in all_patients:
            self.insert(patient)


