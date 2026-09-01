import json
import tkinter.messagebox as messagebox
from collections import deque
import time
import os

class EmployeeNode:
    def __init__(self, emp_id, name, role):
        self.emp_id = emp_id
        self.name = name
        self.role = role
        self.next = None  # Pointer to next sibling
        self.child = None  # Pointer to first child
        self.parent = None  # Pointer to parent
        self.last_child = None  # Pointer to last child for fast insert

class OrganizationChart:
    def __init__(self):
        self.head = None  # Root node (CEO)
        self.employees = {}  # Dictionary for O(1) lookup

    def add_employee(self, parent_id, emp_id, name, role):
        """Adds an employee while enforcing company rules."""

        # Handle CEO addition separately
        if emp_id == 1:
            return self._handle_ceo_addition(name, role)

        # Ensure non-CEO employees have a valid parent
        if parent_id is None or parent_id not in self.employees:
            messagebox.showerror("Error", f"Parent ID {parent_id} not found.")
            return

        # Check if employee ID already exists
        if emp_id in self.employees:
            existing_employee = self.employees[emp_id]
            if existing_employee.name == "[Vacant]":
                existing_employee.name, existing_employee.role = name, role
                messagebox.showinfo("Success", f"Vacant position {emp_id} is now filled by {name}.")
            else:
                messagebox.showerror("Error", f"Employee ID {emp_id} already exists.")
            return

        # Add new employee
        new_employee = EmployeeNode(emp_id, name, role)
        self.employees[emp_id] = new_employee

        # Link to parent
        parent = self.employees[parent_id]
        new_employee.parent = parent

        if not parent.child:
            parent.child = new_employee
            parent.last_child = new_employee
        else:
            parent.last_child.next = new_employee
            parent.last_child = new_employee

        messagebox.showinfo("Success", f"Employee {emp_id} added under {parent_id}.")

    def _handle_ceo_addition(self, name, role):
        """Handles CEO-specific addition logic."""
        if self.head:
            if self.head.name == "[Vacant]":
                self.head.name, self.head.role = name, role
                messagebox.showinfo("Success", f"Vacant CEO position is now filled by {name}.")
            elif self.head.name != name:
                messagebox.showerror("Error", "CEO's name cannot be changed unless the position is vacant.")
            else:
                self.head.role = role
                messagebox.showinfo("Success", f"CEO's role updated: {role}.")
            self.employees[1] = self.head
            return

        # If no CEO exists, create a new one
        self.head = EmployeeNode(1, name, role)
        self.employees[1] = self.head
        messagebox.showinfo("Success", f"CEO {name} added successfully.")

    def vacate_position(self, emp_id):
        employee = self.employees.get(emp_id)
        if not employee:
            messagebox.showerror("Error", "Employee not found.")
            return
        employee.name = "[Vacant]"
        messagebox.showinfo("Success", f"Employee {emp_id} removed. Position is now vacant.")

    def permanently_delete_employee(self, emp_id):
        """Permanently delete an employee and handle subordinates accordingly."""
        employee = self.employees.get(emp_id)
        if not employee:
            messagebox.showerror("Error", "Employee not found.")
            return

        if not messagebox.askyesno("Permanent Delete", f"Are you sure you want to permanently delete Employee {emp_id}?"):
            return

        # Handle CEO deletion separately
        if employee == self.head:
            self._handle_ceo_deletion(employee)
            return

        parent = employee.parent

        if employee.child:
            self._handle_subordinates_deletion(employee, parent)

        self._remove_from_parent(employee, parent)
        self._remove_employee(employee)

        messagebox.showinfo("Success", f"Employee {emp_id} has been permanently deleted.")

    # ---- Helper Functions ----

    def _handle_ceo_deletion(self, ceo):
        print(f"🛑 Deleting CEO: {ceo.name} ({ceo.emp_id})")

        if messagebox.askyesno("Permanent Delete", "You are deleting the CEO. Do you want to delete the entire company?"):
            self.head = None
            self.employees.clear()
            print("✅ Entire organization deleted.")
            return

        if ceo.child:
            print(f"🔄 Promoting a new CEO from {ceo.name}'s children.")
            self._promote_new_ceo(ceo)
        else:
            self.head = None
            self.employees.clear()
            print("❌ No employees left after CEO deletion.")

    def _promote_new_ceo(self, ceo):
        """Promotes the first child of the CEO and correctly reattaches all other employees."""
        new_ceo = ceo.child
        if not new_ceo:
            print("❌ No valid successor. Organization is now empty.")
            self.head = None
            return

        print(f"✅ New CEO: {new_ceo.name} ({new_ceo.emp_id})")

        new_ceo.parent = None
        self.head = new_ceo

        # Move CEO's other children under the new CEO
        sibling = new_ceo.next
        new_ceo.next = None  # Break old sibling link
        new_ceo.last_child = None  # Reset last child

        while sibling:
            next_sibling = sibling.next  # Store next before modifying
            sibling.next = None
            self._append_sibling(new_ceo.child, sibling)
            sibling.parent = new_ceo
            sibling = next_sibling  # Move to the next sibling

        # Ensure last_child is updated
        new_ceo.last_child = self._get_last_child(new_ceo.child)

        print("✅ CEO promotion completed. Updated hierarchy:")
        self.debug_print_hierarchy()

    def _handle_subordinates_deletion(self, employee, parent):
        """Handles subordinate deletion or reassignment when an employee is deleted."""
        if messagebox.askyesno("Delete Subordinates", f"Do you want to delete all subordinates of Employee {employee.emp_id}?"):
            self._delete_subtree(employee.child)
        else:
            self._reassign_subordinates(employee, parent)

    def _reassign_subordinates(self, employee, parent):
        """Reassign subordinates to the parent correctly."""
        if not employee.child:
            return

        first_child = employee.child
        employee.child = None

        if parent:
            parent.child = self._remove_from_sibling_list(parent.child, employee)
            parent.child = self._append_sibling(parent.child, first_child)

            current = first_child
            while current:
                current.parent = parent
                print(f"Reassigned {current.name} ({current.emp_id}) to {parent.name} ({parent.emp_id})")
                current = current.next

            last = parent.child
            while last and last.next:
                last = last.next
            parent.last_child = last

    def _remove_from_parent(self, employee, parent):
        if parent:
            print(f"🛑 Removing {employee.name} ({employee.emp_id}) from {parent.name} ({parent.emp_id})'s children")
            if parent.child == employee:
                parent.child = employee.next
                print(f"✅ {employee.name} ({employee.emp_id}) was the first child, new first child is {parent.child.name if parent.child else 'None'}")
            else:
                self._remove_from_sibling_list(parent.child, employee)

    def _remove_employee(self, employee):
        """Removes an employee from the dictionary."""
        self.employees.pop(employee.emp_id, None)

    def _delete_subtree(self, node):
        """Deletes all subordinates recursively and updates parent references."""
        if not node:
            return

        queue = deque([node])
        parent = node.parent

        while queue:
            current = queue.popleft()

            # Add children and siblings to the queue
            if current.child:
                queue.append(current.child)
            if current.next:
                queue.append(current.next)

            # Remove from employees dictionary
            self.employees.pop(current.emp_id, None)

        # Update parent's child and last_child references if necessary
        if parent:
            if parent.child == node:
                parent.child = node.next  # Move first child reference
            if parent.last_child == node:
                parent.last_child = None  # Last child removed

    def debug_print_hierarchy(self, node=None, level=0):
        """Recursively prints the organizational hierarchy for debugging."""
        if node is None:
            node = self.head
        if node:
            print("  " * level + f"- {node.name} ({node.emp_id})")
            child = node.child
            while child:
                self.debug_print_hierarchy(child, level + 1)
                child = child.next

    def search_employee(self, emp_id):
        employee = self.employees.get(emp_id)
        if employee:
            parent_id = employee.parent.emp_id if employee.parent else "None"
            return f"ID: {employee.emp_id}, Name: {employee.name}, Role: {employee.role}, Parent: {parent_id}"
        return "Employee not found."

    def _remove_from_sibling_list(self, first_sibling, target):
        print(f"🛑 Removing {target.name} ({target.emp_id}) from siblings")

        if not first_sibling or not target:
            print("❌ No siblings found.")
            return first_sibling

        parent = target.parent

        # Case when target is the first sibling
        if first_sibling == target:
            new_first = target.next
            print(f"✅ New first sibling: {new_first.name if new_first else 'None'}")
            return new_first

        # Traverse
        prev, current = None, first_sibling
        while current and current != target:
            prev, current = current, current.next

        if current:
            print(f"✅ Found {target.name}, removing it.")
            prev.next = current.next

        return first_sibling

    def _get_last_child(self, first_child):
        current = first_child
        while current and current.next:
            current = current.next
        return current


    def _append_sibling(self, first_sibling, new_sibling):
        if not first_sibling:
            print(f"✅ First sibling is empty. Setting {new_sibling.name} ({new_sibling.emp_id}) as first.")
            return new_sibling

        print(f"🔄 Appending {new_sibling.name} ({new_sibling.emp_id}) to siblings...")

        current = first_sibling
        while current.next:
            current = current.next

        current.next = new_sibling

        # Ensure parent's last_child is updated
        parent = first_sibling.parent
        if parent:
            last = new_sibling
            while last and last.next:
                last = last.next
            parent.last_child = last
            print(f"✅ Updated {parent.name}'s last child: {parent.last_child.name if parent.last_child else 'None'}")

        return first_sibling

    def _serialize_employee(self, employee):
        """Converts an EmployeeNode into a dictionary format for JSON storage."""
        if not employee:
            return None
        
        data = {
            "emp_id": employee.emp_id,
            "name": employee.name,
            "role": employee.role,
            "last_child": employee.last_child.emp_id if employee.last_child else None,  # Restore last_child
            "subordinates": []
        }

        child = employee.child
        while child:
            data["subordinates"].append(self._serialize_employee(child))
            child = child.next

        return data

    def save_to_json(self, filename="organization.json"):
        """Saves the organization to a JSON file with error handling."""
        if not self.head:
            messagebox.showerror("Error", "No organization data to save.")
            return
        
        data = {
            "organization_name": "My Company",
            "version": "1.0",
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "hierarchy": self._serialize_employee(self.head)
        }

        try:
            with open(filename, "w") as file:
                json.dump(data, file, indent=4)
            messagebox.showinfo("Success", "Organization saved successfully.")
        except Exception as e:
            messagebox.showerror("Save Error", f"Failed to save file: {e}")
            print(f"Error saving file: {e}")  # Debugging log

    def _deserialize_employee(self, data, parent=None):
        """Reconstructs an EmployeeNode from JSON data while maintaining `last_child`."""
        if not data:
            return None

        emp = EmployeeNode(data["emp_id"], data["name"], data["role"])
        emp.parent = parent
        self.employees[emp.emp_id] = emp

        prev_child = None
        first_child = None

        for child_data in data.get("subordinates", []):
            child = self._deserialize_employee(child_data, emp)
            if prev_child:
                prev_child.next = child
            else:
                first_child = child
            prev_child = child

        emp.child = first_child
        emp.last_child = prev_child  # Restore last_child reference

        return emp

    def load_from_json(self, filename="organization.json"):
        """Loads an organization chart from a JSON file."""
        if not os.path.exists(filename):  # Check if file exists
            messagebox.showerror("Error", "Save file not found.")
            return False  # Indicate failure

        try:
            with open(filename, "r") as file:
                data = json.load(file)
                if not data or "hierarchy" not in data:  # Validate data structure
                    messagebox.showerror("Error", "Invalid or empty organization data.")
                    return False  # Indicate failure

                self.head = self._deserialize_employee(data["hierarchy"], None)
                return True  # Indicate success
        except json.JSONDecodeError:
            messagebox.showerror("Error", "Invalid JSON format.")
            return False  # Indicate failure
        except Exception as e:
            messagebox.showerror("Error", f"Unexpected error: {e}")
            return False  # Indicate failure

if __name__ == "__main__":

    # Create an organization chart
    org_chart = OrganizationChart()

    print("=== BEFORE CEO DELETION ===")
    org_chart.debug_print_hierarchy()

    # Delete CEO
    org_chart.permanently_delete_employee(1)

    print("=== AFTER CEO DELETION ===")
    org_chart.debug_print_hierarchy()