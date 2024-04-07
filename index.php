<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Call Insights</title>
    <link href="https://cdn.datatables.net/v/dt/jq-3.7.0/dt-2.0.3/datatables.min.css" rel="stylesheet">
    <link href="https://cdn.datatables.net/2.0.3/css/dataTables.tailwindcss.css" rel="stylesheet">
    <link href="./src/css/global.css" rel="stylesheet">
</head>
<body>
   <main class="h-screen container mx-auto relative">
        <?php include('./components/mode/mode.php'); ?>
        <section class="h-full">
            <div class="h-full flex flex-col justify-center items-center">
                <?php include('./components/form/form.php'); ?>
                <?php include('./components/form/message_area.php'); ?>
                <?php include('./components/form/displaytable.php'); ?>
            </div>
        </section>
   </main>
    <script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp"></script>
    <script src="https://cdn.datatables.net/v/dt/jq-3.7.0/dt-2.0.3/datatables.min.js"></script>
    <script src="https://cdn.datatables.net/2.0.3/js/dataTables.tailwindcss.js"></script>
    <script src="/src/js/mode.js"></script>
    <script src="/src/js/Form.js"></script>
    <script src="/src/js/main.js"></script>
</body>
</html>