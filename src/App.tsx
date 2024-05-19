import { Form, Modal } from 'react-bootstrap'
import PWABadge from './PWABadge.tsx'
import { useEffect, useState } from 'react'


interface Task {
  id: number
  description: string
  starred: boolean
  state: boolean
  date?: Date
}

interface File {
  id: number
  name: string
  tasks: number[]
}

function App() {

  const [tasks, setTasks] = useState<Task[]>([])
  const [filters, setFilters] = useState<string[]>(["all"])
  const [folders, setFolders] = useState<File[]>([])

  const [showFolder, setShowFolder] = useState('All');

  const [showTaskModal, setShowTaskModal] = useState(false);

  const handleCloseTaskModal = () => setShowTaskModal(false);
  const handleShowTaskModal = () => setShowTaskModal(true);

  const [showFolderModal, setShowFolderModal] = useState(false);

  const handleCloseShowFolderModal = () => setShowFolderModal(false);
  const handleShowShowFolderModal = () => setShowFolderModal(true);

  const [dataLoaded, setDataLoaded] = useState(false);

  const loadData = () => {
    const savedTasks = localStorage.getItem('tasks');
    const savedFolders = localStorage.getItem('folders');
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedFolders) setFolders(JSON.parse(savedFolders));
    setDataLoaded(true); // Set dataLoaded to true after loading the data
  }

  const saveData = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('folders', JSON.stringify(folders));
  }


  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (dataLoaded) { // Only save data if it has been loaded
      saveData();
    }
  }, [tasks, folders, dataLoaded])


  const handleTaskState = (id: number) => {
    const newTasks = tasks.map((task) => {
      if (task.id === id) {
        task.state = !task.state
      }
      return task
    })
    setTasks(newTasks)
  }

  const handleTaskStarred = (id: number) => {
    const newTasks = tasks.map((task) => {
      if (task.id === id) {
        task.starred = !task.starred
      }
      return task
    })
    setTasks(newTasks)
  }

  const handleNewTask = () => {
    const description = (document.querySelector('.description-task') as HTMLInputElement).value
    const starred = (document.querySelector('.starred-task')?.querySelector('input') as HTMLInputElement).checked
    const folder = (document.querySelector('.folder-task') as HTMLSelectElement).value
    const newTask: Task = {
      id: tasks.length + 1,
      description: description,
      starred: starred,
      state: false
    }
    if (folder !== 'All') {
      const newFolder = folders.filter((file) => file.name === folder)[0]
      newFolder.tasks.push(newTask.id)
      setFolders([newFolder, ...folders.filter((file) => file.name !== folder)])
      setShowFolder(newFolder.name)
    }
    setShowFolder('All')
    setTasks([newTask, ...tasks])
    handleCloseTaskModal()
  }

  const handleNewFolder = () => {
    const name = (document.querySelector('.description-folder') as HTMLInputElement).value
    const newFolder: File = {
      id: folders.length + 1,
      name: name,
      tasks: []
    }
    setFolders([newFolder, ...folders])
    handleCloseShowFolderModal()
  }

  const handleDeleteFolder = (id: number) => {
    setShowFolder('All')
    const folder = folders.filter((file) => file.id === id)[0]
    const newFolders = folders.filter((file) => file.id !== id)
    const newTasks = tasks.filter((task) => !folder.tasks.includes(task.id))

    setTasks(newTasks)
    setFolders(newFolders)
  }
  const handleShowFolder = (name: string) => {
    setShowFolder(name)
  }

  const handleDeleteTask = (id: number) => {
    const newTasks = tasks.filter((task) => task.id !== id)
    const newFolders = folders.map((file) => {
      file.tasks = file.tasks.filter((taskId) => taskId !== id)
      return file
    })
    setTasks(newTasks)
    setFolders(newFolders)
  }


  const handleFilters = (filter: string) => {

    filters.includes(filter) ? filters.length > 1 ? setFilters(filters.filter((f) => f !== filter))
      : setFilters(['all'])
      : filter === 'all' ? setFilters(['all'])
        : filter === 'todo' ? setFilters([...filters.filter((f) => f !== 'done' && f !== 'all'), 'todo'])
          : filter === 'done' ? setFilters([...filters.filter((f) => f !== 'todo' && f !== 'all'), 'done'])
            : setFilters([...filters.filter((f) => f !== 'all'), filter])
  }


  return (
    <>
      <div className="container d-flex flex-column justify-content-center align-items-center container-app p-4">

        <div className="container head">To<span>Do.</span> App</div>

        <div className="container body  p-4 m-4">
          <div className=" left ">
            <div className="container filters">
              <div className="title d-flex ">
                <p>Filters</p>
              </div>
              <div className="items">
                <div onClick={() => handleFilters('all')} className={`item ${filters.includes('all') ? 'active' : null}`}>
                  <span className="material-symbols-outlined" >inventory_2</span>All
                </div>
                <div onClick={() => handleFilters('todo')} className={`item ${filters.includes('todo') ? 'active' : null}`}>
                  <span className="material-symbols-outlined" >event</span>To Do
                </div>
                <div onClick={() => handleFilters('starred')} className={`item ${filters.includes('starred') ? 'active' : null}`}>
                  <span className="material-symbols-outlined" >Star</span>Starred
                </div>
                <div onClick={() => handleFilters('done')} className={`item ${filters.includes('done') ? 'active' : null}`}>
                  <span className="material-symbols-outlined" >download_done</span>Done
                </div>
              </div>
            </div>
            <br />
            <div className="container projects">
              <div className="title">
                <p>Projects</p>
                <div className='text-end'><span className="material-symbols-outlined" onClick={handleShowShowFolderModal}>add</span></div>
              </div>
              <div className="items">
                <div onClick={() => { handleShowFolder('All') }} className={`item ${showFolder === 'All' ? 'active' : null}`}>
                  <span className="material-symbols-outlined">folder</span>{'All'}
                </div>
                {folders.map((file) => (
                  <div onClick={() => { handleShowFolder(file.name) }} className={`item  ${showFolder === file.name ? 'active' : null}`} key={file.id}>
                    <div><span className="material-symbols-outlined">folder</span></div>
                    <div>{file.name}</div>
                    <div><span onClick={() => handleDeleteFolder(file.id)} className="material-symbols-outlined delete">delete</span></div>                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rigth">
            <div className="container tasks">
              <div className="title">
                <p>Tasks</p>
              </div>
              <div className="items">
                {
                  tasks.length === 0 ? <div className="text-center">No tasks</div> :
                    showFolder === 'All' ? tasks.map((task) => {

                      if (!filters.includes('all') && filters.includes('todo') && task.state) return null

                      if (!filters.includes('all') && filters.includes('done') && !task.state) return null

                      if (!filters.includes('all') && filters.includes('starred') && !task.starred) return null

                      return (
                        <div className="item" key={task.id}>
                          <Form.Check // prettier-ignore
                            type="checkbox"
                            id="custom-switch"
                            {...task.state ? { checked: true } : {}}
                            onChange={() => handleTaskState(task.id)}
                          />
                          <span onClick={() => handleDeleteTask(task.id)} className="material-symbols-outlined delete">delete</span>
                          <div className="text-center description">{task.state ? <del>{task.description}</del> : task.description}</div>
                          <span onClick={() => handleTaskStarred(task.id)} className={`material-symbols-outlined ${task.starred ? 'active' : null}`}>kid_star</span>
                        </div>
                      )
                    }) :

                      folders.filter((file) => file.name === showFolder)[0]?.tasks.map((taskId) => {
                        const task = tasks.filter((task) => task.id === taskId)[0]



                        if (!filters.includes('all') && filters.includes('todo') && task.state) return null

                        if (!filters.includes('all') && filters.includes('done') && !task.state) return null

                        if (!filters.includes('all') && filters.includes('starred') && !task.starred) return null

                        return (
                          <div className="item" key={task.id}>
                            <Form.Check // prettier-ignore
                              type="checkbox"
                              id="custom-switch"
                              {...task.state ? { checked: true } : {}}
                              onChange={() => handleTaskState(task.id)}
                            />
                            <span onClick={() => handleDeleteTask(task.id)} className="material-symbols-outlined delete">delete</span>
                            <div className="text-center description">{task.state ? <del>{task.description}</del> : task.description}</div>
                            <span onClick={() => handleTaskStarred(task.id)} className={`material-symbols-outlined ${task.starred ? 'active' : null}`}>kid_star</span>
                          </div>
                        )
                      })

                }

              </div>
            </div>
            <br />
            <br />
            <div className="button" onClick={handleShowTaskModal}>Add Task</div>
          </div>
        </div>

      </div>
      <Modal show={showTaskModal} onHide={handleCloseTaskModal} centered>
        <Modal.Body>
          <div className="container">
            <div className="close" onClick={handleCloseTaskModal}> <span className="material-symbols-outlined">
              close
            </span></div>
            <br />
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>New Task</Form.Label>
              <Form.Control className='description-task' type="text" placeholder="Enter description" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check className="starred-task" type="checkbox" label="Starred" />
              <Form.Select aria-label="Default select example" className='folder-task'>
                <option>All</option>
                {folders.map((file) => (
                  <option key={file.id}>{file.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <br />
            <br />
            <div className='button' onClick={handleNewTask}>
              Add Task
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showFolderModal} onHide={handleCloseShowFolderModal} centered>
        <Modal.Body>
          <div className="container">
            <div className="close" onClick={handleCloseShowFolderModal}> <span className="material-symbols-outlined">
              close
            </span></div>
            <br />
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>New Folder</Form.Label>
              <Form.Control className='description-folder' type="text" placeholder="Enter Folder Name" />
            </Form.Group>
            <br />
            <br />
            <div className='button' onClick={handleNewFolder}>
              Add Folder
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <div className="container text-center p-2 mb-4">
        Develop by <a href="https://github.com/SevenDogsNTwoCats/">AE9</a>
      </div>



      <PWABadge />
    </>
  )
}

export default App
