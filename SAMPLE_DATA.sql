-- Sample data for Paris research task
-- This script populates the database with a sample task about Paris, France

-- 1. Insert the main task
INSERT INTO Task (task_name, task_description, original_prompt, completion_status)
VALUES (
  'Paris Travel Research',
  'Research fun and interesting activities to do in Paris, France',
  'What are fun things to do in Paris, France?',
  0 -- not completed yet
);

-- Get the last inserted task_id (we'll use 1 for these examples)
SET @task_id = 1;

-- 2. Insert the five subtasks
INSERT INTO SubTask (task_id, subtask_name, subtaskdescript_ion, completion_status)
VALUES
  (@task_id, 'Iconic Landmarks', 'Research the most iconic landmarks and tourist attractions in Paris', 1),
  (@task_id, 'Food and Dining', 'Explore the culinary scene in Paris, from fine dining to street food', 1),
  (@task_id, 'Museums and Art', 'Investigate museums, galleries, and art experiences in Paris', 1),
  (@task_id, 'Day Trips', 'Research possible day trips from Paris to nearby attractions', 1),
  (@task_id, 'Local Experiences', 'Find unique local experiences off the typical tourist path', 1);

-- Get the subtask IDs (we'll use sequential IDs for these examples)
SET @subtask1_id = 1; -- Iconic Landmarks
SET @subtask2_id = 2; -- Food and Dining
SET @subtask3_id = 3; -- Museums and Art
SET @subtask4_id = 4; -- Day Trips
SET @subtask5_id = 5; -- Local Experiences

-- Use the actual product type IDs from the database:
-- 1: article
-- 2: image
-- 3: report
-- 4: presentation
-- 5: dataset
-- 6: infographic
-- 7: faq
-- 8: guide
-- 9: video
-- 10: code

-- 4. Insert products for each subtask
INSERT INTO Product (subtask_id, product_title, product_slug, product_type_id, abstract, content, teaser_image_url, authored_by)
VALUES
  -- Product for Subtask 1: Iconic Landmarks
  (
    @subtask1_id,
    'Must-See Landmarks in Paris: The Ultimate Bucket List',
    'must-see-landmarks-paris-bucket-list',
    8, -- guide
    'Discover the most iconic landmarks in Paris that you absolutely cannot miss on your visit to the City of Light.',
    'Paris is home to some of the world\'s most recognizable landmarks. The Eiffel Tower stands as the city\'s defining monument, offering breathtaking views from its observation decks. The Arc de Triomphe provides a spectacular view down the Champs-Élysées, while Notre-Dame Cathedral showcases gothic architecture at its finest. The Louvre\'s glass pyramid entrance leads to thousands of priceless artworks, including the Mona Lisa. Sacré-Cœur offers panoramic views from Montmartre\'s highest point. These landmarks form the essential Paris experience and should be at the top of any visitor\'s itinerary.',
    'https://static.vecteezy.com/system/resources/previews/016/916/479/original/placeholder-icon-design-free-vector.jpg',
    'AI Assistant'
  ),
  
  -- Product for Subtask 2: Food and Dining
  (
    @subtask2_id,
    'A Culinary Journey Through Paris: From Bistros to Bakeries',
    'culinary-journey-paris-bistros-bakeries',
    1, -- article
    'Explore the gastronomic delights of Paris, from classic French cuisine to modern culinary innovations.',
    'Paris is a paradise for food lovers. Start your day with a fresh croissant or pain au chocolat from a local boulangerie. For lunch, enjoy a classic croque monsieur at a sidewalk café while people-watching. Paris boasts everything from Michelin-starred restaurants to hidden bistros serving traditional fare. Don\'t miss the opportunity to sample authentic French onion soup, coq au vin, and beef bourguignon. The Latin Quarter and Le Marais offer diverse dining options, while food markets like Marché d\'Aligre provide fresh ingredients and street food. Finish your culinary journey with delicate macarons from Ladurée or Pierre Hermé.',
    'https://static.vecteezy.com/system/resources/previews/016/916/479/original/placeholder-icon-design-free-vector.jpg',
    'AI Assistant'
  ),
  
  -- Product for Subtask 3: Museums and Art
  (
    @subtask3_id,
    'Beyond the Louvre: Paris\'s Hidden Art Treasures',
    'beyond-louvre-paris-hidden-art-treasures',
    3, -- report
    'While the Louvre and Musée d\'Orsay deserve their fame, Paris offers many lesser-known museums and galleries worth exploring.',
    'Paris houses over 130 museums, offering something for every interest. Beyond the famous Louvre and Musée d\'Orsay, consider visiting Musée de l\'Orangerie to see Monet\'s Water Lilies in rooms designed by the artist himself. The Centre Pompidou houses Europe\'s largest modern art collection in a striking inside-out building. For something different, explore the Musée Rodin\'s sculpture garden or the romantic Musée de la Vie Romantique. The Petit Palais offers free admission to its permanent collection, while Atelier des Lumières provides immersive digital art experiences. Paris also boasts numerous small galleries in neighborhoods like Saint-Germain-des-Prés and Le Marais, where you can discover emerging artists.',
    'https://static.vecteezy.com/system/resources/previews/016/916/479/original/placeholder-icon-design-free-vector.jpg',
    'AI Assistant'
  ),
  
  -- Product for Subtask 4: Day Trips
  (
    @subtask4_id,
    '5 Perfect Day Trips from Paris',
    '5-perfect-day-trips-paris',
    4, -- presentation
    'Escape the city for a day with these easily accessible destinations that showcase the beauty and history surrounding Paris.',
    'While Paris offers endless activities, the surrounding region contains treasures worth exploring. The Palace of Versailles, just 45 minutes from Paris, showcases royal opulence with its Hall of Mirrors and manicured gardens. Claude Monet\'s home and gardens in Giverny, where he painted his famous water lilies, make for a peaceful retreat. Medieval Chartres Cathedral, with its remarkable stained glass windows, is just an hour away by train. Disneyland Paris provides family fun with two theme parks. The Champagne region, accessible on a day trip, offers tours of prestigious champagne houses like Moët & Chandon. All these destinations are easily reached by train or guided tours departing from central Paris.',
    'https://static.vecteezy.com/system/resources/previews/016/916/479/original/placeholder-icon-design-free-vector.jpg',
    'AI Assistant'
  ),
  
  -- Product for Subtask 5: Local Experiences
  (
    @subtask5_id,
    'Live Like a Parisian: Authentic Local Experiences',
    'live-like-parisian-authentic-local-experiences',
    6, -- infographic
    'Discover how to experience Paris beyond the tourist attractions and enjoy the city as locals do.',
    'To experience Paris like a local, venture beyond tourist hotspots and embrace the Parisian lifestyle. Spend a leisurely afternoon in Luxembourg Gardens, reading or watching locals play pétanque. Explore Canal Saint-Martin, where Parisians gather for picnics and apéro (pre-dinner drinks). Browse the stalls at lesser-known markets like Marché des Enfants Rouges, Paris\'s oldest covered market. Visit Belleville for authentic multicultural cuisine and street art. Join locals at independent bookshops and cinemas in the Latin Quarter. Explore the hidden passages couverts, 19th-century shopping arcades with unique shops and cafés. Take a wine-tasting class to appreciate French wine culture, or learn to make French pastries in a cooking workshop. These experiences offer glimpses into everyday Parisian life that many tourists miss.',
    'https://static.vecteezy.com/system/resources/previews/016/916/479/original/placeholder-icon-design-free-vector.jpg',
    'AI Assistant'
  ),
  
  -- Additional product: Image Gallery
  (
    @subtask1_id,
    'Paris in Pictures: Iconic Views of the City of Light',
    'paris-pictures-iconic-views',
    2, -- image
    'A visual journey through the most photogenic spots in Paris, capturing the city\'s timeless beauty.',
    'This image gallery showcases the visual splendor of Paris from dawn to dusk. From the golden sunrise behind the Eiffel Tower to the illuminated Seine River at night, these images capture the changing moods of the city throughout the day. The collection includes classic postcard views as well as unique perspectives from lesser-known vantage points. Architectural details of Notre-Dame, the ornate bridges spanning the Seine, and the charming streets of Montmartre are presented alongside candid moments of Parisian daily life. Each image is accompanied by location information and photography tips for visitors looking to capture their own memorable shots of the City of Light.',
    'https://static.vecteezy.com/system/resources/previews/016/916/479/original/placeholder-icon-design-free-vector.jpg',
    'AI Assistant'
  ),
  
  -- Additional product: FAQ
  (
    @subtask2_id,
    'Paris Dining FAQs: Everything You Need to Know',
    'paris-dining-faqs',
    7, -- faq
    'Answers to the most common questions about dining in Paris, from tipping etiquette to reservation recommendations.',
    'This comprehensive FAQ covers everything visitors need to know about dining in Paris. Topics include: What are typical French meal times? Is tipping expected in Paris restaurants? Do I need to speak French to dine out? What\'s the difference between a bistro, brasserie, and café? How far in advance should I make reservations? What are the must-try French dishes? Are there good options for vegetarians and vegans? How do I ask for the bill? What\'s the proper etiquette for dining in Paris? Each question is answered with practical, current information to help visitors navigate Paris\'s dining scene with confidence.',
    'https://static.vecteezy.com/system/resources/previews/016/916/479/original/placeholder-icon-design-free-vector.jpg',
    'AI Assistant'
  ),
  
  -- Additional product: Video
  (
    @subtask3_id,
    'Virtual Tour: Hidden Museums of Paris',
    'virtual-tour-hidden-museums-paris',
    9, -- video
    'A video tour of Paris\'s lesser-known but extraordinary museums that offer unique cultural experiences.',
    'This video script provides a virtual tour of five remarkable yet often overlooked museums in Paris. It begins with the intimate Musée Jacquemart-André, a 19th-century mansion housing an impressive collection of Italian Renaissance art. Next, it explores the whimsical Musée de la Chasse et de la Nature (Hunting and Nature Museum), with its surprising contemporary art installations. The tour continues to the Musée des Arts Forains, a private collection of carnival artifacts where visitors can ride antique carousels. The Musée Nissim de Camondo, a perfectly preserved early 20th-century home, offers insights into aristocratic life. Finally, the video concludes at the Musée de la Magie, where the history of magic and illusion comes alive through interactive exhibits and live demonstrations.',
    'https://static.vecteezy.com/system/resources/previews/016/916/479/original/placeholder-icon-design-free-vector.jpg',
    'AI Assistant'
  );

-- 5. Insert attachments for the subtasks
INSERT INTO Attachments (subtask_id, file_url, file_type, mime_type, file_description)
VALUES
  -- Attachments for Iconic Landmarks
  (
    @subtask1_id,
    'https://static.vecteezy.com/system/resources/previews/016/916/479/original/placeholder-icon-design-free-vector.jpg',
    'image',
    'image/jpeg',
    'Eiffel Tower view'
  ),
  (
    @subtask1_id,
    'https://static.vecteezy.com/system/resources/previews/016/916/479/original/placeholder-icon-design-free-vector.jpg',
    'image',
    'image/jpeg',
    'Arc de Triomphe'
  ),
  
  -- Attachments for Food and Dining
  (
    @subtask2_id,
    'https://static.vecteezy.com/system/resources/previews/016/916/479/original/placeholder-icon-design-free-vector.jpg',
    'image',
    'image/jpeg',
    'French pastries'
  ),
  (
    @subtask2_id,
    'https://static.vecteezy.com/system/resources/previews/016/916/479/original/placeholder-icon-design-free-vector.jpg',
    'image',
    'image/jpeg',
    'Parisian café'
  ),
  
  -- Attachments for Museums and Art
  (
    @subtask3_id,
    'https://static.vecteezy.com/system/resources/previews/016/916/479/original/placeholder-icon-design-free-vector.jpg',
    'image',
    'image/jpeg',
    'Louvre Museum'
  ),
  (
    @subtask3_id,
    'https://static.vecteezy.com/system/resources/previews/016/916/479/original/placeholder-icon-design-free-vector.jpg',
    'image',
    'image/jpeg',
    'Musée d\'Orsay interior'
  ),
  
  -- Attachments for Day Trips
  (
    @subtask4_id,
    'https://static.vecteezy.com/system/resources/previews/016/916/479/original/placeholder-icon-design-free-vector.jpg',
    'image',
    'image/jpeg',
    'Palace of Versailles'
  ),
  (
    @subtask4_id,
    'https://static.vecteezy.com/system/resources/previews/016/916/479/original/placeholder-icon-design-free-vector.jpg',
    'image',
    'image/jpeg',
    'Monet\'s garden in Giverny'
  ),
  
  -- Attachments for Local Experiences
  (
    @subtask5_id,
    'https://static.vecteezy.com/system/resources/previews/016/916/479/original/placeholder-icon-design-free-vector.jpg',
    'image',
    'image/jpeg',
    'Luxembourg Gardens'
  ),
  (
    @subtask5_id,
    'https://static.vecteezy.com/system/resources/previews/016/916/479/original/placeholder-icon-design-free-vector.jpg',
    'image',
    'image/jpeg',
    'Canal Saint-Martin'
  );

-- This script creates a complete sample task with:
-- 1 main task about Paris
-- 5 subtasks covering different aspects of Paris
-- 8 products using various product types (with actual product_type_ids from the database)
-- 10 image attachments (two for each subtask) using the placeholder image URL 