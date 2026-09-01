import tkinter as tk
from tkinter import ttk, messagebox
from org import OrganizationChart  # Import your organization logic
import json  # Make sure to import json at the top
import os

class OrganizationGUI:
    def __init__(self, master):
        self.master = master
        self.master.title("Organizational Chart Management System")
        self.master.geometry("1200x1000")

        self.org = OrganizationChart()

        # Define input field
        self.parent_id = tk.StringVar()
        self.emp_id = tk.StringVar()
        self.name = tk.StringVar()
        self.role = tk.StringVar()

        # Styling
        style = ttk.Style()
        style.configure("TLabel", font=("Arial", 12))
        style.configure("TButton", font=("Arial", 12), padding=6)
        style.configure("Treeview", font=("Arial", 10), rowheight=20)

        # Main Frame
        main_frame = ttk.Frame(master, padding=20)
        main_frame.pack(fill="both", expand=True)

        # Form Frame
        form_frame = ttk.Frame(main_frame)
        form_frame.pack(fill="x", pady=10)

        label_font = ("Arial", 12, "bold")
        entry_font = ("Arial", 12)

        for i, (text, var) in enumerate([
            ("Parent ID:", self.parent_id),
            ("Employee ID:", self.emp_id),
            ("Name:", self.name),
            ("Role:", self.role)
        ]):
            ttk.Label(form_frame, text=text, font=label_font).grid(row=i, column=0, padx=5, pady=5, sticky="e")
            entry = ttk.Entry(form_frame, textvariable=var, font=entry_font)
            entry.grid(row=i, column=1, padx=5, pady=5, ipadx=10, ipady=5, sticky="ew")
            form_frame.columnconfigure(1, weight=1)

        # Button Frame
        button_frame = ttk.Frame(main_frame)
        button_frame.pack(fill="x", pady=15)

        ttk.Button(button_frame, text="➕ Add Employee", command=self.add_employee).pack(side="left", expand=True, padx=10)
        ttk.Button(button_frame, text="❌ Vacate Position", command=self.vacate_position).pack(side="left", expand=True, padx=10)
        ttk.Button(button_frame, text="🗑️ Permanent Delete", command=self.permanently_delete_employee).pack(side="left", expand=True, padx=10)
        ttk.Button(button_frame, text="🔍 Search Employee", command=self.search_employee).pack(side="left", expand=True, padx=10)
        
        # Save & Load Buttons
        ttk.Button(button_frame, text="💾 Save", command=self.save_organization).pack(side="left", expand=True, padx=10)
        ttk.Button(button_frame, text="📂 Load", command=self.load_organization).pack(side="left", expand=True, padx=10)

        # Display Hierarchy Button
        ttk.Button(main_frame, text="📊 Display Hierarchy", command=self.display_hierarchy).pack(fill="x", pady=10)

        # TreeView Frame
        tree_frame = ttk.Frame(main_frame)
        tree_frame.pack(fill="both", expand=True, padx=10, pady=10)

        # FIXED: Show hierarchical structure but store Employee ID & Role
        self.tree = ttk.Treeview(tree_frame, columns=("ID", "Role"), show="tree")
        self.tree.pack(fill="both", expand=True)

        self.tree.bind("<<TreeviewSelect>>", self.on_tree_select)

    def add_employee(self):
        """Handles adding an employee from GUI input."""
        parent_id = int(self.parent_id.get()) if self.parent_id.get().isdigit() else None
        emp_id = self.validate_emp_id()
        if emp_id is None:
            return

        self.org.add_employee(parent_id, emp_id, self.name.get(), self.role.get())
        self.clear_fields()
        self.display_hierarchy()

    def vacate_position(self):
        """Handles deleting an employee from GUI input."""
        emp_id = self.validate_emp_id()
        if emp_id is None:
            return

        self.org.vacate_position(emp_id)
        self.clear_fields()
        self.display_hierarchy()

    def permanently_delete_employee(self):
        emp_id = self.validate_emp_id()
        if emp_id is None:
            return

        self.org.permanently_delete_employee(emp_id)

        # FORCE UI REFRESH AFTER DELETION
        self.tree.delete(*self.tree.get_children())

        print(f"Refreshing UI, Remaining Employees: {self.org.employees.keys()}")  # Debugging print

        if self.org.head:
            self.display_hierarchy()  # Correct way to update UI
        else:
            messagebox.showinfo("Info", "The organization is now empty.")

    def search_employee(self):
        """Handles searching for an employee from GUI input."""
        emp_id = self.validate_emp_id()
        if emp_id is None:
            return

        result = self.org.search_employee(emp_id)
        messagebox.showinfo("Search Result", result)

    def display_hierarchy(self):
        """Refreshes the TreeView hierarchy and ensures a valid CEO exists."""
        self.tree.delete(*self.tree.get_children())  # Clear tree

        if not self.org.head:
            print("No CEO found. Organization is empty.")
            messagebox.showinfo("Info", "The organization is now empty.")
            return  # Exit without displaying anything

        print(f"Displaying hierarchy from CEO: {self.org.head.name} ({self.org.head.emp_id})")
        self._add_to_tree("", self.org.head)

    def _add_to_tree(self, parent, node):
        """Recursively adds employees to the tree view."""
        display_text = f"{node.name} ({node.role})"
        if node.name == "[Vacant]":
            display_text = f"🔴 [Vacant] ({node.role})"  # Highlight vacant positions

        # FIXED: Store both `ID` and `Role` properly while keeping hierarchy
        item = self.tree.insert(parent, "end", text=display_text, values=(node.emp_id, node.role))

        # Recursively add all children
        child = node.child
        while child:
            self._add_to_tree(item, child)
            child = child.next

    def clear_fields(self):
        """Clears all input fields."""
        self.parent_id.set("")
        self.emp_id.set("")
        self.name.set("")
        self.role.set("")
    
    def validate_emp_id(self):
        """Validates and returns the employee ID as an integer, or None if invalid."""
        if not (emp_id := self.emp_id.get().strip()):
            messagebox.showerror("Error", "Please enter an Employee ID.")
            return None
        if not emp_id.isdigit():
            messagebox.showerror("Error", "Employee ID must be a number.")
            return None
        return int(emp_id)

    def on_tree_select(self, event):
        """Handles filling input fields when selecting a tree node."""
        selected_item = self.tree.selection()
        if not selected_item:
            return

        item = selected_item[0]  # Get the selected item
        values = self.tree.item(item, "values")  # Extract stored values (ID, Role)
        name_with_role = self.tree.item(item, "text")  # Extract displayed text

        # Handle missing values safely
        emp_id = values[0] if values else ""
        role = values[1] if len(values) > 1 else ""

        # Extract name from "Name (Role)" format safely
        name = name_with_role.rsplit(" (", 1)[0] if name_with_role else ""

        # Set input fields
        self.emp_id.set(emp_id)
        self.name.set(name)
        self.role.set(role)

        # Set Parent ID (if applicable)
        parent = self.tree.parent(item)
        if parent:
            parent_values = self.tree.item(parent, "values")
            self.parent_id.set(parent_values[0] if parent_values else "")
        else:
            self.parent_id.set("")

    def save_organization(self):
        """Saves the organization chart to a JSON file."""
        filename = "organization_chart.json"
        try:
            self.org.save_to_json(filename)  # Use save_to_json() directly
            messagebox.showinfo("Success", f"Organization saved to {filename}")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to save organization: {e}")

    def load_organization(self):
        """Loads the organization chart from a JSON file."""
        filename = "organization_chart.json"
        
        if not os.path.exists(filename):  # Explicitly check file existence
            messagebox.showwarning("Warning", "No saved organization found.")
            return

        try:
            success = self.org.load_from_json(filename)  # Ensure this method returns a boolean
            if success:
                self.display_hierarchy()  # Refresh UI only if data was loaded
                messagebox.showinfo("Success", "Organization loaded successfully.")
            else:
                messagebox.showwarning("Warning", "File exists but contains no valid data.")
        except json.JSONDecodeError:  # Handle corrupt JSON
            messagebox.showerror("Error", "The file is corrupt or not in a valid format.")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to load organization: {e}")

if __name__ == "__main__":
    root = tk.Tk()
    app = OrganizationGUI(root)
    root.mainloop()