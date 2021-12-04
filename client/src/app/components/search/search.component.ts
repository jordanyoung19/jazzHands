import { Component, OnInit, ViewChild } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { ResourceData } from '../../data/resource-data';
import { HandtrackerComponent } from '../handtracker/handtracker.component';
import { PredictionEvent } from 'src/app/prediction-event';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [ SpotifyService ]
})
export class SearchComponent implements OnInit {
  searchString:string;
  searchCategory:string = 'artist';
  searchCategories:string[] = ['artist', 'album', 'track'];
  resources:ResourceData[];
  carouselId: string = "carousel-id";
  // tester for swipe 
  xCorrdinates:Number[] = [];
  @ViewChild(HandtrackerComponent) child:HandtrackerComponent;

  constructor(private spotifyService:SpotifyService) { }

  ngOnInit() {
  }

  search() {
    //TODO: call search function in spotifyService and parse response

    // Only update category once search button is clicked, but can't update this.searchCategory too early or
    // else it might render the wrong carousel/track-list component before updating this.resources
    const searchDropdown = document.getElementById('category-dropdown') as HTMLSelectElement;
    const tempCategory = searchDropdown.options[searchDropdown.selectedIndex].value;

    this.spotifyService.searchFor(tempCategory, this.searchString).then(response => {
      this.resources = response;
      this.searchCategory = tempCategory;
    });
  }

  prediction(event: PredictionEvent){
    if (event.getPrediction() == "Two Open Hands"){
      this.child.stopDetection();
      this.search();
    } else if (event.getPrediction() == "Closed Hand") {
      this.xCorrdinates.push(event.getCoordinate());
      console.log("x coordinates: ", this.xCorrdinates);
      
      if (this.xCorrdinates.length == 5) {
        if (this.isSorted(this.xCorrdinates)) {
          console.log("success!");
          this.xCorrdinates.shift();
        } else if (this.isInverseSorted(this.xCorrdinates)) {
          console.log("success here!");
          this.xCorrdinates.shift();
        } else {
          this.xCorrdinates.shift();
        }
      }
    }
  }

  isSorted(arr:Number[]) {
    let sorted = true;

    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] > arr[i+1]) {
        sorted = false;
        break;
      }
    }

    return sorted;
  }

  isInverseSorted(arr:Number[]) {
    let sorted = true;

    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] < arr[i+1]) {
        sorted = false;
        break;
      }
    }

    return sorted;
  }
}
