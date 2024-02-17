INSERT INTO public.account 
(account_firstname, account_lastname, account_email, account_password)
VALUES('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n')



UPDATE public.account SET account_type = 'Admin' WHERE account_id = 1;

DELETE FROM public.account WHERE account_id = 1


UPDATE public.inventory
SET inv_description = REGEXP_REPLACE(inv_description, 'small interiors', 'huge interiors', 'gi')
WHERE inv_id = 10;


SELECT i.inv_make, i.inv_model, c.classification_name  FROM public.inventory AS i
INNER JOIN public.classification AS c ON c.classification_id = i.classification_id
WHERE c.classification_id = 2


UPDATE public.inventory
SET inv_image = REGEXP_REPLACE(inv_image, '/images/', '/images/vehicles/', 'gi'),
	inv_thumbnail = REGEXP_REPLACE(inv_thumbnail, '/images/', '/images/vehicles/', 'gi');

