import tkinter as tk
from tkinter import ttk, messagebox
import time

class Process:
    def __init__(self, pid, arrival_time, burst_time):
        self.pid = pid
        self.arrival_time = arrival_time
        self.burst_time = burst_time
        self.remaining_time = burst_time
        self.state = 'New'
        self.start_time = None
        self.finish_time = None

def simulate_states(processes, quantum):
    time_elapsed = 0
    queue = []
    gantt_chart = []
    state_changes = []

    while processes or queue:
        # Mover procesos llegados al tiempo actual a la cola
        while processes and processes[0].arrival_time <= time_elapsed:
            process = processes.pop(0)
            process.state = 'Ready'
            queue.append(process)
            state_changes.append((process.pid, 'New', 'Ready', time_elapsed))
        
        if queue:
            process = queue.pop(0)
            if process.state == 'Ready':
                state_changes.append((process.pid, 'Ready', 'Running', time_elapsed))
                process.state = 'Running'
            execution_time = min(process.remaining_time, quantum)
            process.remaining_time -= execution_time
            time_elapsed += execution_time
            gantt_chart.append((process.pid, time_elapsed - execution_time, time_elapsed))
            
            if process.remaining_time > 0:
                state_changes.append((process.pid, 'Running', 'Ready', time_elapsed))
                process.state = 'Ready'
                queue.append(process)
            else:
                state_changes.append((process.pid, 'Running', 'Terminated', time_elapsed))
                process.finish_time = time_elapsed
                process.state = 'Terminated'
        else:
            time_elapsed += 1
    
    return gantt_chart, state_changes

class SchedulerApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Process Scheduler")

        self.processes = []

        # Labels and Entry widgets
        ttk.Label(root, text="Process ID:").grid(row=0, column=0, padx=10, pady=10)
        self.pid_entry = ttk.Entry(root)
        self.pid_entry.grid(row=0, column=1, padx=10, pady=10)

        ttk.Label(root, text="Arrival Time:").grid(row=1, column=0, padx=10, pady=10)
        self.arrival_entry = ttk.Entry(root)
        self.arrival_entry.grid(row=1, column=1, padx=10, pady=10)

        ttk.Label(root, text="Burst Time:").grid(row=2, column=0, padx=10, pady=10)
        self.burst_entry = ttk.Entry(root)
        self.burst_entry.grid(row=2, column=1, padx=10, pady=10)

        ttk.Label(root, text="Quantum:").grid(row=3, column=0, padx=10, pady=10)
        self.quantum_entry = ttk.Entry(root)
        self.quantum_entry.grid(row=3, column=1, padx=10, pady=10)

        # Buttons
        self.add_button = ttk.Button(root, text="Add Process", command=self.add_process)
        self.add_button.grid(row=4, column=0, columnspan=2, pady=10)

        self.run_button = ttk.Button(root, text="Run Simulation", command=self.run_simulation)
        self.run_button.grid(row=5, column=0, columnspan=2, pady=10)

        # Output Text
        self.output_text = tk.Text(root, height=20, width=60)
        self.output_text.grid(row=6, column=0, columnspan=2, padx=10, pady=10)

    def add_process(self):
        try:
            pid = int(self.pid_entry.get())
            arrival_time = int(self.arrival_entry.get())
            burst_time = int(self.burst_entry.get())
            process = Process(pid, arrival_time, burst_time)
            self.processes.append(process)
            self.output_text.insert(tk.END, f"Added Process: ID={pid}, Arrival Time={arrival_time}, Burst Time={burst_time}\n")
            self.pid_entry.delete(0, tk.END)
            self.arrival_entry.delete(0, tk.END)
            self.burst_entry.delete(0, tk.END)
        except ValueError:
            messagebox.showerror("Input Error", "Please enter valid integers for all fields.")

    def run_simulation(self):
        try:
            quantum = int(self.quantum_entry.get())
            gantt_chart, state_changes = simulate_states(self.processes, quantum)
            
            self.output_text.insert(tk.END, "\nGantt Chart:\n")
            for pid, start, end in gantt_chart:
                self.output_text.insert(tk.END, f"Process {pid}: {start} - {end}\n")
            
            self.output_text.insert(tk.END, "\nState Changes:\n")
            for pid, old_state, new_state, time in state_changes:
                self.output_text.insert(tk.END, f"Process {pid}: {old_state} -> {new_state} at time {time}\n")
            
            self.output_text.insert(tk.END, "\nProcess Details:\n")
            for process in self.processes:
                self.output_text.insert(tk.END, f"Process {process.pid}: Start Time = {process.start_time}, Finish Time = {process.finish_time}\n")
        except ValueError:
            messagebox.showerror("Input Error", "Please enter a valid integer for quantum.")

if __name__ == "__main__":
    root = tk.Tk()
    app = SchedulerApp(root)
    root.mainloop()
