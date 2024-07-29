# RWMB_math_operator_Field
The RWMB_math_operator_Field class is a custom field extension for the Meta Box plugin in WordPress, enabling users to create fields that perform mathematical operations on other fields. This field type can also aggregate values from cloned fields if configured to act as a total value field.

Extended from the RWMB_math_operator_Field by Kevin Lanteri Kraeutler https://github.com/kevinlanteri/RWMB_math_operator_Field

I use this with WPCodeBox (https://wpcodebox.com/) but any wp code snippet will do. You can also use files instead, if you prefer.

Key functionalities and features include:

Custom Field HTML Output:

The field's HTML is dynamically generated based on the provided configurations.
It includes an input field for displaying the result of the mathematical operation.
A hidden input field is used to store the option indicating whether the field acts as a total value field.
A script element stores data attributes for JavaScript to process.
JavaScript Integration:

The necessary JavaScript libraries (math.js and rwmb) are enqueued to handle the calculations.
Conditional logic is added to dynamically show/hide specific fields based on user interaction, particularly whether the field is configured to act as a total value field.
Meta Box Builder Integration:

The custom field type is registered with the Meta Box Builder, including options for the field IDs to calculate, the mathematical formula, and the option to act as a total value field.
Admin Footer JavaScript:

A script in the admin footer handles the dynamic showing/hiding of fields and recalculates values based on user input.
Mutation observers track changes to the form, ensuring that the functionality works correctly even when fields are dynamically added or cloned.
Usage Instructions
Installation
Include the PHP Class:

Add the RWMB_math_operator_Field class definition to your theme or plugin.
Enqueue JavaScript Dependencies:

Ensure that the math.js and rwmb libraries are enqueued by calling the add_actions method of the class.
Add to Meta Box Builder:

Use the Meta Box Builder to add the math_operator field type to your custom meta boxes.
Configure the field options such as id_to_calc, formula, and act_as_total_value as needed.
Example Configuration
Here is an example of how to configure the math_operator field in the Meta Box Builder:

- Field IDs to Perform the Calculation On: field1,field2
- Calculation Formula: (field1 + field2) * 3
- Act as Total Value: Checked (if this field should sum up values of all cloned fields and itself)
This configuration will calculate the result based on the provided formula and display the result in the math_operator field. If the field is set to act as a total value, it will sum up all other values of its clones.
