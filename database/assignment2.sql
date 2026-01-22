-- Insert a new record into a table
INSERT INTO public.account (
	account_firstname, 
	account_lastname,
	account_email,
	account_password
)
VALUES (
	'Tony',
	'Stark',
	'tony@starkent.com',
	'Iam1ronM@n'
);

-- Modify a record
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;

-- Delete a record
DELETE FROM public.account
WHERE account_id = 1;

-- Modify part of a record using the REPLACE() function
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_id = 10;

-- Inner Join
SELECT inv_make, inv_model
FROM public.inventory
INNER JOIN public.classification
ON public.inventory.classification_id = public.classification.classification_id
WHERE classification_name = 'Sport';

-- Modifying multiple columns with REPLACE()
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, 'images', 'images/vehicles'),
    inv_thumbnail = REPLACE(inv_thumbnail, 'images', 'images/vehicles');