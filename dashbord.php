<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashbord</title>
    <link href="https://cdn.datatables.net/v/dt/jq-3.7.0/dt-2.0.3/datatables.min.css" rel="stylesheet">
    <link href="https://cdn.datatables.net/2.0.3/css/dataTables.tailwindcss.css" rel="stylesheet">
    <link href="./src/css/global.css" rel="stylesheet">
</head>
<body>
    <main class="min-h-screen container-fluid px-8 relative bg-[#F9FAFB] dark:bg-[#111827]">
        <?php include('./components/mode/mode.php'); ?>
        <div class="px-8 py-8 h-full" id="dashbord">
            <?php include('./components/dashbord/grid_stats.php')?>
            <?php include('./components/dashbord/display_tables.php')?>
            <?php include('./components/dashbord/grid_viz.php')?>
        </div>
    </main>
<script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp"></script>
<script src="https://cdn.datatables.net/v/dt/jq-3.7.0/dt-2.0.3/datatables.min.js"></script>
<script src="https://cdn.datatables.net/2.0.3/js/dataTables.tailwindcss.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js" integrity="sha512-vc58qvvBdrDR4etbxMdlTt4GBQk1qjvyORR2nrsPsFPyrs+/u5c3+1Ct6upOgdZoIl7eq6k3a1UPDSNAQi/32A==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script src="/src/js/mode.js"></script>
<script src="/src/js/dashbord.js"></script>
<script src="/src/js/main.js"></script>
</body>
</html>